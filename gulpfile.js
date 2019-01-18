'use strict'

const gulp = require('gulp');
const del = require('del');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const atImport = require('postcss-import');
const cssnext = require('postcss-cssnext');
const nested = require('postcss-nested');
const short = require('postcss-short');
const assets = require('postcss-assets');
const sourcemaps = require('gulp-sourcemaps');
const mqpacker = require('css-mqpacker');
const pugBeautify = require('gulp-pug-beautify');
const rename = require('gulp-rename');
const newer = require('gulp-newer');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const cleanCSS = require('gulp-cleancss');
const pug = require('gulp-pug');
const cached = require('gulp-cached');
const remember = require('gulp-remember');
const gulpIf = require('gulp-if');
const debug = require('gulp-debug');
const size = require('gulp-size');
const insert = require('gulp-insert');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const pngquant = require('imagemin-pngquant');
const stylelint = require('stylelint');
const configStylelint = require('./.stylelintrc');
const reporterBrowser = require('postcss-browser-reporter');
const typograf = require('gulp-typograf');
const jsonlint = require('gulp-jsonlint');
const babel = require('gulp-babel');
const file = require('gulp-file');
const include = require('gulp-include');

const path = {
	dist: {
		base: 'dist/',
		pages: 'dist/*.html',
		js: 'dist/js/',
		css: 'dist/css/',
		img: 'dist/assets/img/',
		icons: 'dist/assets/icon/',
		fonts: 'dist/assets/fonts/',
		source: 'dist/assets/source/',
		uploads: 'dist/assets/uploads/'
	},
	src: {
		pages: 'src/pug/*.pug',
		scripts: 'src/scripts/custom/*.js',
		libsJS: 'src/scripts/libs/',
		style: 'src/styles/custom/style.css',
		libsCSS: './src/styles/libs/*.css',
		icons: 'src/assets/icon/*.{gif,png,jpg,jpeg,svg}',
		img: 'src/assets/img/**/*.{gif,png,jpg,jpeg,svg}',
		uploads: 'src/assets/uploads/**/*.{gif,png,jpg,jpeg,svg}',
		fonts: 'src/assets/fonts/**/*.{woff,woff2}',
		source: 'src/assets/source/**/*'
	},
	watch: {
		pages: 'src/pug/**/*.pug',
		scripts: 'src/scripts/custom/*.js',
		libsJS: 'src/scripts/libs/*.js',
		style: 'src/styles/custom/**/*.css',
		libsCSS: './src/styles/libs/*.css',
		icons: 'src/assets/icon/*.{gif,png,jpg,jpeg,svg}',
		img: 'src/assets/img/**/*.{gif,png,jpg,jpeg,svg}',
		uploads: 'src/assets/uploads/**/*.{gif,png,jpg,jpeg,svg}',
		fonts: 'src/assets/fonts/**/*',
		source: 'src/assets/source/**/*'
	},
	root: './dist'
};

const config = {};
config.env = process.env.NODE_ENV || 'null';

let styleFileMsg = '/*!*\n * ВНИМАНИЕ! Этот файл генерируется автоматически.\n * Не пишите сюда ничего вручную, все такие правки будут потеряны при следующей компиляции.\n * Правки без возможности компиляции ДОЛЬШЕ И ДОРОЖЕ в 2-3 раза.\n * Нужны дополнительные стили - пиши в "custom.css".\n * Читайте ./README.md для понимания.\n */\n\n\n';
let scriptFileMsg = '/*!*\n * ВНИМАНИЕ! Этот файл генерируется автоматически.\n *  * Не пишите сюда ничего вручную. Нужно дописать? прошу в "custom.js".\n */\n\n\n';


const processors = [
	atImport,
	stylelint(configStylelint),
	cssnext({ 							// Автопреффиксер включен в этот плагин, отдельно подключать не нужно.
		'customProperties': true,
		'customFunction': true,
		'customSelectors': true
	}),
	reporterBrowser({
		'selector': 'body:before'
	}),
	nested,
	short,
	assets({
		loadPaths: ['src/assets/**/*'],
		relativeTo: 'src/styles/'
	}),
	mqpacker({
		sort: true
	})
];

// ЗАДАЧА: Очистка папки сборки
//
gulp.task('clean', function() {
	console.log('---------- Прибираюсь ----------');
	return del([ path.root, '!' + 'build/readme.md' ]);		// кроме readme.md
});

// ЗАДАЧА: Компиляция стилей
//
gulp.task('styles', function() {
	console.log('========================================= Значение NODE_ENV: ' + config.env + ' поехали: =========================================');
	console.log('---------- Собираю стили: ----------');
	return gulp.src(path.src.style)
		.pipe(plumber({
			errorHandler: notify.onError(function(err) {
				return {
					title: 'Styles',
					message: err.message
				}
			})
		}))
		.pipe(debug({title: 'Style:'}))
		.pipe(gulpIf(config.env === 'development', sourcemaps.init()))
		.pipe(postcss(processors))
		.pipe(gulpIf(config.env === 'development', sourcemaps.write('/')))
		.pipe(gulp.dest(path.dist.css))
		.pipe(cleanCSS())
		.pipe(browserSync.stream())
		.pipe(insert.prepend(styleFileMsg))
		.pipe(rename('style.min.css'))
		.pipe(gulp.dest(path.dist.css))
});

gulp.task('styles:libs', function() {
	console.log('---------- Собираю стили библиотек: ----------');
	return gulp.src(path.src.libsCSS)
		.pipe(plumber({
			errorHandler: notify.onError(function(err) {
				return {
					title: 'Styles',
					message: err.message
				}
			})
		}))
		.pipe(debug({title: 'libs styles:'}))
		.pipe(cleanCSS())
		.pipe(concat('libs.min.css'))
		.pipe(insert.prepend(styleFileMsg))
		.pipe(gulp.dest(path.dist.css))
		.pipe(browserSync.stream())
		.pipe(size({
			title: 'Размер:',
			showFiles: true,
			showTotal: false
		}));
});

// ЗАДАЧА: Компиляция страниц
//
gulp.task('pug', function() {
	console.log('---------- Собираю страницы ----------');
	return gulp.src(path.src.pages)

		.pipe(plumber({
			errorHandler: notify.onError(function(err) {
				return {
					title: 'Pugs',
					message: err.message
				}
			})
		}))
		.pipe(pug({pretty: true}))
		.pipe(pugBeautify({
			omit_empty: true,
			fill_tab: true,
			tab_size: 4
		}))
		.pipe(gulp.dest(path.dist.base));
});

// ЗАДАЧА: Копирование изображений
//
gulp.task('images', function () {
	console.log('---------- Веду обработку картинок ----------');
	gulp.src(path.src.icons)
		.pipe(plumber({
			errorHandler: notify.onError(function(err) {
				return {
					title: 'Images',
					message: err.message
				}
			})
		}))
		.pipe(newer(path.dist.icons)) // оставить в потоке только новые файлы (сравниваем с содержимым папки билда)
		.pipe(gulpIf(config.env === 'production', imagemin([
				imagemin.gifsicle({interlaced: true}),
				imagemin.jpegtran({progressive: true}),
				imageminJpegRecompress({
					loops: 5,
					min: 65,
					max: 70,
					quality:'medium'
				}),
				imagemin.optipng({optimizationLevel: 3}),
				pngquant({quality: '65-70', speed: 5})
			],{	verbose: true })
		))
		.pipe(gulp.dest(path.dist.icons))
	gulp.src(path.src.img)
		.pipe(plumber({
			errorHandler: notify.onError(function(err) {
				return {
					title: 'Images',
					message: err.message
				}
			})
		}))
		.pipe(newer(path.dist.img)) // оставить в потоке только новые файлы (сравниваем с содержимым папки билда)
		.pipe(gulpIf(config.env === 'production', imagemin([
				imagemin.gifsicle({interlaced: true}),
				imagemin.jpegtran({progressive: true}),
				imageminJpegRecompress({
					loops: 5,
					min: 65,
					max: 70,
					quality:'medium'
				}),
				imagemin.optipng({optimizationLevel: 3}),
				pngquant({quality: '65-70', speed: 5})
			],{	verbose: true })
		))
		.pipe(gulp.dest(path.dist.img))
	return gulp.src(path.src.uploads)
		.pipe(plumber({
			errorHandler: notify.onError(function(err) {
				return {
					title: 'Images',
					message: err.message
				}
			})
		}))
		.pipe(newer(path.dist.uploads)) // оставить в потоке только новые файлы (сравниваем с содержимым папки билда)
		.pipe(gulpIf(config.env === 'production', imagemin([
				imagemin.gifsicle({interlaced: true}),
				imagemin.jpegtran({progressive: true}),
				imageminJpegRecompress({
					loops: 5,
					min: 65,
					max: 70,
					quality:'medium'
				}),
				imagemin.optipng({optimizationLevel: 3}),
				pngquant({quality: '65-70', speed: 5})
			],{	verbose: true })
		))
		.pipe(gulp.dest(path.dist.uploads))
});

// Задача: Копирование шрифтов
//
gulp.task('fonts', function() {
	console.log('---------- Переношу шрифты: ----------');
	return gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.dist.fonts))
});

// Задача: Typograf
//
gulp.task('typograf', function() {
	return gulp.src(path.dist.pages)
		.pipe(typograf({
			locale: ['ru', 'en-US'],
			// Type of HTML entities: 'digit' - &#160;, 'name' - &nbsp;, 'default' - UTF-8
			htmlEntity: { type: 'digit' },
			disableRule: ['ru/optalign/*'],
			enableRule: ['ru/money/ruble'],
			safeTags: [
				['<\\?php', '\\?>'],
				['<no-typography>', '</no-typography>']
			]
		}))
		.pipe(gulp.dest(path.dist.base))
});

// Задача: JSON_Lint
//
gulp.task('jsonLint', function() {
	return gulp.src('src/assets/source/**/*.json')
		.pipe(debug({ title: 'JSON:' }))
		.pipe(jsonlint())
		.pipe(jsonlint.reporter())
});

// Задача: Копирование ресурсов (видео и др.)
//
gulp.task('source', function() {
	console.log('---------- Сурсы переношу: ----------');
	return gulp.src(path.src.source)
		.pipe(debug({ title: 'source:' }))
		.pipe(gulp.dest(path.dist.source))
});

// ЗАДАЧА: Конкатенация и углификация Javascript
//
gulp.task('scripts', function () {
	console.log('---------- Собираю скрипты ----------');
	return gulp.src(path.src.scripts)
		.pipe(include())
		.pipe(plumber({
			errorHandler: notify.onError(function(err) {
				return {
					title: 'Scripts',
					message: err.message
				}
			})
		}))
		.pipe(babel())
		.pipe(insert.prepend(scriptFileMsg))
		.pipe(gulp.dest(path.dist.js));
});

gulp.task('libsJS', function () {
	return gulp.src([
		path.src.libsJS + 'jquery-*(\d)*.*(\d)*.*(\d)*.js',
		path.src.libsJS + '!(jquery-*(\d)*.*(\d)*.*(\d)*).js'
	])
		.pipe(plumber({
			errorHandler: notify.onError(function(err) {
				return {
					title: 'Scripts',
					message: err.message
				}
			})
		}))
		.pipe(concat('libs.min.js'))
		.pipe(uglify({
			mangle: false,
			compress: false,
			output: { beautify: true }
		}))
		.pipe(insert.prepend(scriptFileMsg))
		.pipe(gulp.dest(path.dist.js))
		.pipe(size({
			title: 'Размер:',
			showFiles: true,
			showTotal: false
		}));
});

// ЗАДАЧА: Сборка всего
//
gulp.task('build', gulp.series(
	'clean',
	gulp.parallel('styles', 'styles:libs', 'libsJS', 'scripts', 'fonts', 'images', 'source', 'jsonLint'), 'pug', 'typograf'
));

// ЗАДАЧА: Локальный сервер, слежение
//
gulp.task('dev', gulp.series('build', function() {
	console.log('---------- Все готово. ----------');
	browserSync.init({
		server: {
			baseDir: path.root
		},
		port: 3000,
		startPath: '/index.html',
		open: true
	});

	gulp.watch(path.watch.pages, gulp.series('pug', reloader));
	gulp.watch(path.watch.style, gulp.series('styles'));
	gulp.watch(path.watch.libsCSS, gulp.series('styles:libs'));
	gulp.watch(path.watch.fonts, gulp.series('fonts', reloader));
	gulp.watch(path.watch.img, gulp.series('images', reloader));
	gulp.watch(path.watch.icons, gulp.series('images', reloader));
	gulp.watch(path.watch.uploads, gulp.series('images', reloader));
	gulp.watch(path.watch.source, gulp.series('source', reloader));
	gulp.watch(path.watch.source, gulp.series('jsonLint', reloader));
	gulp.watch(path.watch.scripts, gulp.series('scripts', reloader));
	gulp.watch(path.watch.libsJS, gulp.series('libsJS', reloader));
}));

// ЗАДАЧА: Задача по умолчанию
//
gulp.task('default',
	gulp.series('dev')
);

// Дополнительная функция для перезагрузки в браузере
//
function reloader(done) {
	browserSync.reload();
	done();
}
