function setHref(href) {
  window.location.href = href;
}
function getHref() {
  return window.location.href;
}
function winOpen(href) {
  window.open(href);
}
function parseParams(query) {
  var re = /([^&=]+)=?([^&]*)/g,
    decodeRE = /\+/g,
    decode = function decode(str) {
      return decodeURIComponent(str.replace(decodeRE, " "));
    };
  let params = {},
    e;
  while ((e = re.exec(query))) params[decode(e[1])] = decode(e[2]);
  return params;
}

function sendNotification(title,options){
  if (window.Notification) {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("safari") != -1) {
      if (ua.indexOf("chrome") > -1) { // Chrome
        Notification.requestPermission().then(function (permission) {
          if (permission == "granted") {
            // var notification = new Notification("桌面推送", {
            //   body: "这是我的第一条桌面推送",
            //   icon: "some/icon/url",
            // });
            var notification = new Notification(title, options);
            notification.onclick = function () {
              notification.close();
            };
          } else {
            Notification.requestPermission();
            // console.log("没有权限,用户拒绝:Notification");
          }
        });
      } else { // Safari
        Notification.requestPermission(function (permission) {
          if (permission == "granted") {
            var notification = new Notification(title, options);
            notification.onclick = function () {
              notification.close();
            };
          } else {
            Notification.requestPermission();
            // console.log("没有权限,用户拒绝:Notification");
          }
        });
      }
    }
  } else {
    // console.log('不支持Notification');
  }
}

if (!Date.prototype.format){
  function formatTimestamp(timestamp, format = 'YYYY/MM/DD hh:mm:ss') {
    let time = Number.parseInt(timestamp, 10);
    let date = new Date(time);

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    month = month > 9 ? month : `0${month}`;
    day = day > 9 ? day : `0${day}`;
    hour = hour > 9 ? hour : `0${hour}`;
    minute = minute > 9 ? minute : `0${minute}`;
    second = second > 9 ? second : `0${second}`;

    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('hh', hour)
      .replace('mm', minute)
      .replace('ss', second);
  }
  Date.prototype.format = function (format) {
    if(typeof this === 'number'){
      return formatTimestamp(this, format)
    } else if (typeof this === 'object'){
      return formatTimestamp(+this, format)
    }
    return this
  }
}
if(!Date.prototype.fullTime){
  Date.prototype.fullTime = function () {
    return (new Date()).format()
  }
}


// window.chrome.runtime.id

function jump(target){
  const params = parseParams(getHref().split("?")[1]);
  setHref(params[target]);
}
// web通用助手，自定义助手
const matchs = [
  {
    name:'zhihuJump',
    type:'ready',
    url: new RegExp("link.zhihu.com", "i"),
    operate:function(){
      jump('target')
    }
  },
  {
    name:'csdnJump',
    type:'ready',
    url: new RegExp("link.csdn.net", "i"),
    operate:function(){
      jump('target')
    }
  },
  {
    name:'jianshuJump',
    type:'ready',
    url: new RegExp("jianshu.com/go-wild", "i"),
    operate:function(){
      jump('url')
    }
  },
  {
    name:'*',
    type:'ready',
    url: new RegExp(".*", "i"),
    operate: function(){
      class Alarm{
        constructor(){
          this.TIMEOUT = 5 * 60 * 1000
          this.RIGHT = 10
          this._timeout = 0
          this._timer = 0
        }
        start(){
          this.$box = $(`<div class="PANDA_ALARM"></div>`)
          this.$alarm = $(`<div class="ALARM">${new Date().fullTime()}</div>`)
          this.$text = $(`<span>是时候喝水了额~</span>`)
          this.$box.append(this.$alarm)
          this.$box.append(this.$text)

          this._timer = setInterval(_=> {
            this.$alarm.text(new Date().fullTime())
          }, 1000)
          this._timeout = setTimeout(() => {
            clearTimeout(this._timeout)
            this.close()
          }, this.TIMEOUT);
          $('body').append(this.$box)
          this.$box.animate({
            right: this.RIGHT + 'px'
          }, 1000, _=>{
            // console.log("动画执行完毕!");
          })
        }
        close(){
          this.$box && this.$box.animate({
            right: -(this.$box.outerWidth()+10) + 'px'
          }, 1000, _ => {
            clearInterval(this._timer)
            this.$box.remove()
          })
        }
        setup(){
          this.env()
          setInterval(_ => {
            let time = new Date()
            if (time.getMinutes() === 0 && time.getSeconds() === 0) {
              this.start()
            }
          }, 1000)
        }
        env(){
          const text = `
            .PANDA_ALARM{
              box-sizing:border-box;
              position: fixed;
              margin-bottom: 16px;
              margin-left: auto;
              padding: 16px 24px;
              overflow: hidden;
              line-height: 1.5715;
              word-wrap: break-word;
              background-color: #fff;
              border-radius: 2px;
              box-shadow: 0 3px 6px -4px #0000001f, 0 6px 16px #00000014, 0 9px 28px 8px #0000000d;
              z-index: 10000;
              width: 300px;
              font-size:20px;
              right: -210px;
              top: 24px;
              bottom: auto;
              color:red;
            }
          `
          let $style = $('<style></style>')
          $style.text(text)
          $('body').append($style)
        }
      }
      new Alarm().setup()
    }
  },
  {
    name:'**',
    type:'load',
    url: [new RegExp("blog.csdn.net", "i"), new RegExp("jianshu.com", "i")],
    operate: function() {
      var loop = function (func) {
        var loop_time = 10;
        func.interval = setInterval(function () {
          if (func.time) {
            if (func.time >= loop_time) {
              clearInterval(func.interval);
              return 0;
            }
            func.time += 1;
          } else {
            func.time = 1;
          }
          if (func()) {
            clearInterval(func.interval);
            return 0;
          }
        }, 500);
      };
      var main = function () {
        Array.prototype.forEach.call(document.getElementsByTagName("*"), function (el) {
          ["user-select", "-webkit-user-select", "-moz-user-select", "-ms-user-select"].forEach(xcanwin => {
            var filterstyle = document.defaultView.getComputedStyle(el, null)[xcanwin];
            if (filterstyle && filterstyle == 'none') {
              el.style = xcanwin + ": text !important";
            }
          });

          ["onselect", "onselectstart", "oncopy", "onbeforecopy", "oncontextmenu"].forEach(xcanwin => {
            el[xcanwin] = function (e) {
              e.stopImmediatePropagation();
            }
          });
        });
      };
      loop(main);
    }
  },
  {
    name:'zhihu',
    type:'load',
    url: [new RegExp("zhihu.com/question", "i"),new RegExp('zhuanlan.zhihu.com','i')],
    operate: function() {
      document.querySelectorAll('.Button.Modal-closeButton.Button--plain').forEach(i => {
        if (i) i.click()
      })
    }
  },
  {
    name:'jianshu',
    type:'load',
    url:new RegExp("jianshu.com/p", "i"),
    operate: function() {
      document.querySelectorAll('button').forEach(i => {
        if (i.textContent === '阅读全文') {
          i.click()
        }
      })
    }
  },
  {
    name:'baiduAd',
    type:'load',
    url:new RegExp("baidu.com/s", "i"),
    description:'去除百度广告，根据#content_left盒子下不带className',
    operate: function () {
      const leftContent = document.querySelector('#content_left')
      if (leftContent) {
        const children = leftContent.children
        for (let i = 0; i < children.length; i++) {
          if (children[i].className === '') {
            children[i].remove()
          }
        }
      }
    }
  },
  {
    name:'csdn',
    type:'load',
    url:new RegExp("blog.csdn.net/.*/article/details", "i"),
    description:'关注博主展开全文',
    operate:function() {
      let follow = document.querySelector('#btn-readmore-zk')
      if (follow) {
        document.querySelector('#article_content').style.height = 'auto'
        follow.parentNode.remove()
      }
    }
  }
];

function execute({ href, url, operate }) {
  if (url.test(href)) {
    if(typeof operate === 'function'){
      operate()
    }else{
      (new Function(operate))();
    }
  }
}
function luncher(item){
  const { url, operate } = item,href = getHref();
  if (Array.isArray(url)) {
    url.forEach(j => {
      execute({ href, url: j, operate });
    });
    return 
  }
  execute({ href, url, operate });
}

$(window).on("load", function () {
  matchs.filter(match=>match.type === 'load').forEach(luncher);
});

$(document).ready(function () {
  matchs.filter(match=>match.type === 'ready').forEach(luncher);
});
