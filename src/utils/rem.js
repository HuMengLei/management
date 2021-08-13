
// import store from '@/store';
let tid;
function refreshRem() {
    let designSize = 1920; // 设计图尺寸
    let html = document.documentElement;
    let wW = html.clientWidth;// 窗口宽度
    // 设置最小适应宽度为1000px
    let rem = wW > 1000 ? wW * 100 / designSize : 1000 * 100 / designSize;
    document.documentElement.style.fontSize = rem + 'px';
}

window.addEventListener('resize', function () {
    clearTimeout(tid);
    tid = setTimeout(refreshRem, 300);
}, false);
window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
        clearTimeout(tid);
        tid = setTimeout(refreshRem, 300);
    }
}, false);
refreshRem();