
const hexToRgb = (hexCode) => {
	const aRgbHex = hexCode.match(/.{1,2}/g);
	return [
		parseInt(aRgbHex[0],16),
		parseInt(aRgbHex[1],16),
		parseInt(aRgbHex[2],16),
	];
}
const rgbToHex = (rgb) => {
	return rgb[0].toString(16) + rgb[1].toString(16) + rgb[2].toString(16);
}
const darkenRgb = (rgb) => {
	return [
		Math.max(rgb[0]-20,0),
		Math.max(rgb[1]-30,0),
		Math.max(rgb[2]-40,0)
	]
}
const darkenHex = (hexCode) => {
	return rgbToHex(darkenRgb(hexToRgb(hexCode)));
}
const getContrastingTextColor = (hexCode) => {
	const rgb = hexToRgb(hexCode);
	return rgbToHex([
		255-rgb[0],
		255-rgb[1],
		255-rgb[2]
	]);
}


export {
	hexToRgb,
	rgbToHex,
	darkenRgb,
	darkenHex,
	getContrastingTextColor
}