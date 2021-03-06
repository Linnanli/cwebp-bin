'use strict';
const path = require('path');
const test = require('ava');
const execa = require('execa');
const tempy = require('tempy');
const binCheck = require('bin-check');
const compareSize = require('compare-size');
const cwebp = require('..');

test('return path to binary and verify that it is working', async t => {
	t.true(await binCheck(cwebp, ['-version']));
});

test('minify and convert a PNG to WebP', async t => {
	const tmp = tempy.directory();
	const src = path.join(__dirname, 'fixtures/test.png');
	const dest = path.join(tmp, 'test-png.webp');
	const args = [
		src,
		'-o',
		dest
	];

	await execa(cwebp, args);
	const res = await compareSize(src, dest);

	t.true(res[dest] < res[src]);
});

test('minify and convert a JPG to WebP', async t => {
	const tmp = tempy.directory();
	const src = path.join(__dirname, 'fixtures/test.jpg');
	const dest = path.join(tmp, 'test-jpg.webp');
	const args = [
		src,
		'-o',
		dest
	];

	await execa(cwebp, args);
	const res = await compareSize(src, dest);

	t.true(res[dest] < res[src]);
});

test('download binary from specify url', t => {
	const cwebpLib = require('../lib');
	// How to set environment variable or npm config variable to test custom url
	const defaultBinBaseUrl = 'https://raw.githubusercontent.com/imagemin/cwebp-bin';
	const isDefaultUrl = cwebpLib.src().map(_src => _src.url).every(_url => _url.startsWith(defaultBinBaseUrl));
	t.true(isDefaultUrl);
});
