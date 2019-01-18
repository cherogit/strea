# Сборка front-end отдела AstraMG:

## Запуск сборки:

- Запуск delopment `npm run dev`
- Запуск production `npm run build`

## Структура сборки:

### Пути к ресурсам
```
const path = {
	dist: {
		pages: 'dist/',
		js: 'dist/js/',
		css: 'dist/css/',
		img: 'dist/img/',
		icons: 'dist/assets/icon/',
		fonts: 'dist/assets/fonts/'
	},
	src: {
		pages: 'src/pug/*.pug',
		scriptJS: 'src/scripts/custom/script.js',
		customJS: 'src/scripts/custom/custom.js',
		libsJS: 'src/scripts/libs/',
		style: 'src/styles/style.css',
		libsCSS: './src/styles/libs/*.css',
		icons: 'src/assets/images/icon/*.{gif,png,jpg,jpeg,svg}',
		img: 'src/assets/images/img/**/*.{gif,png,jpg,jpeg,svg}',
		fonts: 'src/assets/fonts/**/*.{woff,woff2}'
	},
	watch: {
		pages: 'src/pug/**/*.pug',
		scripts: 'src/scripts/**/*.js',
		styles: 'src/styles/**/*.css',
		images: 'src/assets/images/**/*',
		fonts: 'src/assets/fonts/**/*'
	},
	base: './dist'
};
```

### О чем пойдет речь ниже:
```
- Gulp#4
- Pug
- PostCSS
- Stylelint
- ESlint
- Fonts only woff && woff2
- Images {gif,png,jpg,jpeg,svg}
``` 
