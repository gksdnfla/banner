var bannerSwiper = function(element,images,bgs,viewStatus){
      $bannerBox = element;
      // 这是轮播图容器
      $ul = $('<ul class="banner-list"></ul>');
      // 翻页icon
      $iconList = $('<ul class="icon-list"></ul>');

      $iconList.css({
          width: 12*images.length+'px',
          zIndex: images.length+1,
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: '4px'
      });

      $bannerBox.append($ul);
      $bannerBox.append($iconList);

      creatBg(bgs[0]);
      function creatBg(bgs){
          var $bg = $('<img class="bg"/>');
          // if(bgs.length == 1){
          //     $bg.attr('src', bgs[0].src);
          //     $bannerBox.append($bg);
          //     $bg.on('load', function(){
          //         if(document.documentElement.clientWidth <= 360){
          //             $bg.css('top',-$bg.height()*0.1+'px')
          //             $bannerBox.css('height',($(this).height()*0.9)+'px');
          //         }else{
          //             $bg.css('top',-$bg.height()*0.15+'px')
          //             // *0.85的原因是为了解决banner和顶部的距离太高， #bannerBox img给了负值
          //             $bannerBox.css('height',($(this).height()*0.85)+'px');
          //         }
          //         createBanner(images);
          //     });
          // }else if(bgs.length == images.length){

          //     $.each(bgs, function(index,item){
          //         console.log(1)
          //         $bg.attr('src', bgs[index].src);
          //         $bannerBox.append($bg);
          //         $bg.css({
          //             'zIndex': bgs.length-index,
          //         });
          //         $bg.on('load', function(){
          //             console.log(2)
          //             $bannerBox.css('height',($(this).height()/0.85)+'px');
          //             createBanner(images);
          //         })
          //     })

          // }





          if (!bgs.src) {
              // 给一个默认的背景图片，已解决背景图没有配置导致的轮播无法显示问题
              $bg.attr('src','http://d8.yihaodianimg.com/N11/M06/7B/D1/ChEwoVp9OLeAX4KmAAIERLjKYS465700.png');
              $bg.css('filter','blur(20px)');
          }else{
              $bg.attr('src', bgs.src);
          }
          // 添加背景
          $bannerBox.append($bg);
          $bg.css({
              // 'zIndex': images.length-index,
          });
          $bg.on('load', function(){
              if(document.documentElement.clientWidth <= 360){
                  $bg.css('top',-$bg.height()*0.1+'px')
                  $bannerBox.css('height',($(this).height()*0.9)+'px');
              }else{
                  $bg.css('top',-$bg.height()*0.15+'px')
                  // *0.85的原因是为了解决banner和顶部的距离太高， #bannerBox img给了负值
                  $bannerBox.css('height',($(this).height()*0.85)+'px');
              }
              createBanner(images);
          });
      }

      // 创建轮播banner
      function createBanner(images){
          console.log(3)

          var boxWidth = $bannerBox.children('img.bg').width();
          var boxHeight = $bannerBox.children('img.bg').height();

          // 计算宽高比例banner相对于背景img的宽高比,背景和banner对齐的核心
          var imgWidthPer = 1030/1242;
          var imgHeightPer = 440/792;
          // 根据宽高比计算ul的宽高
          $ul[0].bannerWidth = boxWidth*imgWidthPer;
          $ul[0].bannerHeight = boxHeight*imgHeightPer;

          var ulWidth = $ul[0].bannerWidth*images.length;
          // count是为了计算当前哪个li处于active的状态
          $ul[0].count = 0;
          // 用来记录ul移动的距离
          $ul[0].x = 0;

          $.each(images, function(index, item){

              // 为了跳转加一个a标签放banner图
              var $aChor = $('<a></a>');
              // 创建banner容器
              var $banner = $('<li></li>');
              // 创建翻页按钮
              var $icon = $('<li></li>');
              // 设置a链接的跳转地址
              $aChor.attr('href', item.link);


              $aChor.css({
                  backgroundImage: 'url('+item.src+')',
                  backgroundSize: boxWidth+'px '+boxHeight+'px',
                  // x方向给-50% 水平方向默认取中间一块 ，y方向用外层box的高度减去底部的距离减去ul的高度
                  // backgroundPosition: '50% '+ -(boxHeight-40*imgHeightPer-$ul[0].bannerHeight)+'px'
              });
              // 完全对齐的情况(第一张用背景图的，后面取数组里面的url)
              // if(index == 0){
              //     $aChor.css('backgroundPosition','50% '+ -(boxHeight-40*imgHeightPer-$ul[0].bannerHeight)+'px')
              // }else{
              //     $aChor.css({
              //         backgroundPosition:'0 0',
              //         backgroundSize:'cover'
              //     })
              // }
              $aChor.css({
                  backgroundPosition:'0 0',
                  backgroundSize:'cover'
              })
              // 给放banner的li设置宽高
              $banner.css({
                  width: $ul[0].bannerWidth+'px', //1030
                  height: $ul[0].bannerHeight+'px', //440
              });

              $iconList.append($icon);
              $banner.append($aChor);
              $ul.append($banner);
          });


          if(images.length >= 2){
              // 为了实现无缝滚动，左右两边露出的li不为空，所以要把li复制3份
              $ul.html($ul.html()+$ul.html()+$ul.html())
              $ul.css({
                  width: $bannerBox.width()*imgWidthPer*images.length*3,
                  left: (boxWidth-$ul[0].bannerWidth)/2-ulWidth+'px',
                  bottom: 40*imgHeightPer+'px',
                  zIndex: images.length+1
              });
              // 给实际展示的banner添加一个view的属性，方便后端同学绑定数据
              for(var i =images.length;i<images.length*2;i++){
                  $ul.children('li').eq(i).attr('view','viewBanner');
                  // 在这里给实际的banner添加属性

              }
          }

          $ul.children().eq(images.length+$ul[0].count).addClass('active');
          $iconList.children().eq($ul[0].count%images.length).addClass('cur');

          $ul.on('transitionend', function(){
              if($ul[0].count >= images.length){
                  $ul[0].count = 0;
                  $ul.css('transition', '');
                  $ul.find('a').css('transition', '');
                  $ul[0].x = 0;
                  $ul.css('transform', 'translateX(-0px)');
                  setActive($ul);
              }
              if($ul[0].count <= -1){
                  $ul[0].count = images.length - 1;
                  $ul.css('transition', '');
                  $ul.find('a').css('transition', '');
                  $ul[0].x = -$ul[0].bannerWidth*$ul[0].count;
                  $ul.css('transform', 'translateX('+ $ul[0].x +'px)');
                  setActive($ul);
              }
          });

          drag();
          if(viewStatus && viewStatus === '1'){
              autoPlay();
          }else{
              stopAutoPlay();
          }
      }

      function next(){
          $ul[0].count++;

          $ul.find('a').css('transition', '0.3s linear');

          $ul[0].x = -$ul[0].bannerWidth*$ul[0].count;
          $ul.css({
              transform: 'translateX('+ $ul[0].x +'px)',
              transition: '0.3s linear'
          });
          setActive();
          // changeBg();
      }

      function prev(){
          $ul[0].count--;

          $ul.find('a').css('transition', '0.3s linear');

          $ul[0].x = -$ul[0].bannerWidth*$ul[0].count;
          $ul.css({
              transform: 'translateX('+ $ul[0].x +'px)',
              transition: '0.3s linear'
          });
          setActive();
          // changeBg();
      }

      function setActive(){
          $ul.children().removeClass('active');
          $ul.children().eq(images.length+$ul[0].count).addClass('active');
          $iconList.children().removeClass('cur');
          $iconList.children().eq($ul[0].count%images.length).addClass('cur');
      }

      function changeBg(){
          var bgs = $bannerBox.find('img.bg');

          bgs.css('opacity', '0');
          bgs.eq($ul[0].count%images.length).css('opacity', '1');
      }

      function drag(){
          var firstTouchX = 0;
          var firstTouchY = 0;
          var status = '';
          $(document).on('touchstart', function(ev){
              firstTouchX = ev.touches[0].pageX;
              firstTouchY = ev.touches[0].pageY;

              window.clearInterval($ul[0].timer);
              $ul.css('transition', '');

              $(document).on('touchmove', touchmove);
              $(document).on('touchend', touchend);
          });

          var touchmove = function(ev){

              var curX = ev.touches[0].pageX - firstTouchX;
              var curY = ev.touches[0].pageY - firstTouchY;
              console.log(curX,curY)
              // 解决上下滑晃动
              if(Math.abs(curY) < 50){
                  if(curX > 50){
                      status = 'prev';
                  }
                  else if(curX < -50){
                      status = 'next';
                  }
                  else{
                      status = 'cur';
                  }
                  ev.preventDefault();
              }

              $ul.css('transform', 'translateX('+ (curX+$ul[0].x) +'px)');
          }

          var touchend = function(){
              $ul.css('transition', '0.3s linear');

              switch(status){
                  case 'cur':
                      $ul.css('transform', 'translateX('+ $ul[0].x +'px)');
                      break;
                  case 'next':
                      next();
                      break;
                  case 'prev':
                      prev();
                      break;
              }

              autoPlay();
              $(document).off('touchmove', touchmove);
              $(document).off('touchend', touchend);
          }
      }
      function autoPlay(){
          window.clearInterval($ul[0].timer);
          $ul[0].timer = window.setInterval(function(){
              next();
          }, 4000);
      }
      function stopAutoPlay(){
          window.clearInterval($ul[0].timer);
      }
}
       
