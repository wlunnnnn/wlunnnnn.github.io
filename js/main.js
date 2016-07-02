/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-06-30 22:02:00
 * @version $Id$
 */
$(function(){
	//插件配置
	var pcBgColor = ['#49e', '#6c9', '#49e', '#6c9','#49e','#6c9'];
	var isEn = window.location.href.indexOf('en.html') >= 0;
	$('#fullpage').fullpage({
		sectionsColor: pcBgColor,
		navigation: true,
		resize: true,
		scrollOverflow: true,
		scrollOverflowOptions: {
			scrollbars: true,
	        mouseWheel: true,
	        hideScrollbars: false,
	        fadeScrollbars: false,
	        disableMouse: true
		}
	});
});
