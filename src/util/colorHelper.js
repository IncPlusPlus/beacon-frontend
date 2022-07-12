
const hexToRgb = (hexCode) => {
	const aRgbHex = hexCode.match(/.{1,2}/g);
	return [
		parseInt(aRgbHex[0],16),
		parseInt(aRgbHex[1],16),
		parseInt(aRgbHex[2],16),
	];
}
const rgbToHex = (rgb) => {
	return rgb[0].toString(16).padStart(2,'0') + rgb[1].toString(16).padStart(2,'0') + rgb[2].toString(16).padStart(2,'0');
}
const darkenRgb = (rgb) => {
	return [
		Math.max(rgb[0]-30,0),
		Math.max(rgb[1]-30,0),
		Math.max(rgb[2]-30,0)
	]
}
const darkenHex = (hexCode) => {
	return rgbToHex(darkenRgb(hexToRgb(hexCode)));
}

// Thanks https://stackoverflow.com/questions/635022/calculating-contrasting-colours-in-javascript
function getContrastingTextColor(color)
{
    return (luma(color) >= 165) ? '000' : 'fff';
}
function luma(color) // color can be a hx string or an array of RGB values 0-255
{
    var rgb = (typeof color === 'string') ? hexToRgb(color) : color;
    return (0.2126 * rgb[0]) + (0.7152 * rgb[1]) + (0.0722 * rgb[2]); // SMPTE C, Rec. 709 weightings
}


export {
	hexToRgb,
	rgbToHex,
	darkenRgb,
	darkenHex,
	getContrastingTextColor,
}