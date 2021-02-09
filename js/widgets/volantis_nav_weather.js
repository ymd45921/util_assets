/**
 * 针对于 Hexo Volantis 主题的
 * 可以在 navbar 的右侧显示一个天气小组件
 * 
 * 修改方法：
 * - 在 header.ejs 中，在 menu navigation 之后插入
 *       <div id="tp-weather-widget"></div>
 * - 再继续插入 script 标签引用对饮的 .min.js
 */
(function(a, h, g, f, e, d, c, b) {
	b = function() {
		d = h.createElement(g);
		c = h.getElementsByTagName(g)[0];
		d.src = e;
		d.charset = "utf-8";
		d.async = 1;
		c.parentNode.insertBefore(d, c)
	};
	a["SeniverseWeatherWidgetObject"] = f;
	a[f] || (a[f] = function() { (a[f].q = a[f].q || []).push(arguments)
	});
	a[f].l = +new Date();
	if (a.attachEvent) {
		a.attachEvent("onload", b)
	} else {
		a.addEventListener("load", b, false)
	}
} (window, document, "script", "SeniverseWeatherWidget", "//cdn.sencdn.com/widget2/static/js/bundle.js?t=" + parseInt((new Date().getTime() / 100000000).toString(), 10)));
window.SeniverseWeatherWidget('show', {
	flavor: "slim",
	location: "WMK9GMWT6GW4",
	geolocation: true,
	language: "auto",
	unit: "c",
	theme: "auto",
	token: "6d40a309-89a2-4342-b5a6-18b6b8be692f",
	hover: "enabled",
	container: "tp-weather-widget"
})