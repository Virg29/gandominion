const path = require('path')
const fs = require('fs')
const process = require('process')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')
var package = require('./package.json')

const appDirectory = process.cwd()
module.exports = {
	mode: 'development',
	entry: {
		ui: './src/src/ui/js.ts',
	},
	output: {
		path: path.resolve(__dirname, 'dist/'),
		filename: '[name].bundle.js',
		library: '[name]',
		libraryTarget: 'umd',
	},
	devServer: {
		static: {
			directory: path.join(__dirname, 'public'),
		},
		compress: true,
		port: process.env.DEV_PORT ? process.env.DEV_PORT : 8301,
		// open: ['/'],
		hot: true,
	},
	resolve: {
		// Add `.ts` and `.tsx` as a resolvable extension.
		extensions: ['.ts', '.tsx', '.js'],
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				HOST: JSON.stringify(process.env.HOST),
				HOST_PORT: JSON.stringify(process.env.HOST_PORT),
			},
		}),
		new HtmlWebpackPlugin({
			inject: true,
			template: './src/html/main/index.html',
			filename: './index.html',
			chunks: ['ui'],
		}),
		new CleanWebpackPlugin({
			path: './dist',
		}),
	],
	module: {
		rules: [
			// {
			// 	test: /\.js$/,
			// 	enforce: 'pre',
			// 	use: ['source-map-loader'],
			// },
			// {
			// 	test: /\.(png|jpe?g|gif)$/i,
			// 	use: [
			// 		{
			// 			loader: 'file-loader',
			// 		},
			// 	],
			// },
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					// Creates `style` nodes from JS strings
					'style-loader',
					// Translates CSS into CommonJS
					'css-loader',
					// Compiles Sass to CSS
					'sass-loader',
				],
			},
			{
				test: /\.css$/i,
				use: [
					// Creates `style` nodes from JS strings
					'style-loader',
					// Translates CSS into CommonJS
					'css-loader',
				],
			},
			{
				test: /\.(svg|eot|woff|ttf|svg|woff2)$/,
				type: 'asset/resource',
			},
			{
				test: /\.(png|jpg|gif|ico)$/i,
				type: 'asset/resource',
			},
			{
				test: /\.html$/i,
				loader: 'html-loader',
			},
		],
	},
}
