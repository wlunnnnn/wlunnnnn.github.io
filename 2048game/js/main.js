$(function(){

	/*数据*/
	var board=new Array(4);
	var score=0;
	var container=$('.grid-container');
	var clientWidth=$(window).width();
	var boxWidth;
	var cellWidth;
	var marginWidth;
	var startx;
	var starty;
	var endx;
	var endy;
	setStyle();
	newGame();
	$('#newBtn').on('click',function(){
		newGame();
	})
	$('#newBtn').on('tap',function(){
		alert()
		newGame();
	})


	/*newGame*/
	function newGame(){
		score=0;
		$('#score').text(score);
		/*Game Over*/
		$('.page').animate({
			opacity:0
		});

		/*控制方向移动*/
		$(document).bind('keydown',keyDown);

		/*初始化布局*/
		init();	

		/*随机初始化两个数字*/
		rndNumberCell();
		rndNumberCell();
	}

	/*初始化布局*/
	function init(){
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				$('#grid-cell-'+i+'-'+j).css({
					left:getPos(i,j).left,
					top:getPos(i,j).top
				});
			};
		};
		/*初始化二维数组*/
		create2Array();

		/*更新board到视图*/
		updateView();
		
	}



	/*更新board到视图*/
	function updateView(){
		container.find('.number-cell').remove();
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				container.append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
				if(board[i][j]==0){
					$('#number-cell-'+i+'-'+j).css({
						width:0,
						height:0,
						left:getPos(i,j).left+cellWidth/2,
						top:getPos(i,j).top+cellWidth/2,
						'line-height':cellWidth+'px'
					});
				}else{
					$('#number-cell-'+i+'-'+j).css({
						width:cellWidth,
						height:cellWidth,
						left:getPos(i,j).left,
						top:getPos(i,j).top,
						'line-height':cellWidth+'px'
					}).text(board[i][j]);
				}
			};
		};
	}

	/*获取到父级距离*/
	function getPos(i,j){
		return {left:marginWidth+(marginWidth+cellWidth)*j, top:marginWidth+(marginWidth+cellWidth)*i};
	}
	/*创建二维数组*/
	function create2Array(){
		for (var i = 0; i < 4; i++) {
			board[i]=new Array();
			for (var j = 0; j < 4; j++) {
				board[i][j]=0;
			};
		};
	}

	/*生成数字*/
	function rndNumberCell(){
		if(isRndNumberCell()){
			createmberCell();
		}
	}

	/*创建数字*/
	function createmberCell(){
		var i=rndNumber();
		var j=rndNumber();
		while($('#number-cell-'+i+'-'+j).text()!=0){
			i=rndNumber();
			j=rndNumber();
		}
		var number=Math.random()>0.6?4:2;
		$('#number-cell-'+i+'-'+j).animate({
			width:cellWidth,
			height:cellWidth,
			left:getPos(i,j).left,
			top:getPos(i,j).top
		}).text(number)
		board[i][j]=number;
	}


	/*判断是否还生成*/
	function isRndNumberCell(){
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				if(board[i][j]==0){
					return true;
				}
			};
		};
		return false;
	}
	/*生成随机数*/
	function rndNumber(){
		return Math.floor(Math.random()*4);
	}

	$(document).on('touchmove',function(ev){
		ev.preventDefault();
	});

	$(document).on('touchstart',function(ev){
		startx=ev.originalEvent.changedTouches[0].pageX;
		starty=ev.originalEvent.changedTouches[0].pageY;
		
	})
	$(document).on('touchend',function(ev){
		endx=ev.originalEvent.changedTouches[0].pageX;
		endy=ev.originalEvent.changedTouches[0].pageY;

		var disx=startx-endx;
		var disy=starty-endy;
		if(Math.abs(disx)>Math.abs(disy)){
			/*x方向移动*/
			if(startx-endx<-10){
				moveRight();
			}else if(startx-endx>10){
				moveLeft();
			}
		}else{
			/*y方向移动*/
			if(starty-endy<-10){
				moveBottom();
			}else if(starty-endy>10){
				moveTop();
			}
		}
		$('#score').text(score);
	})


	/*控制方向移动*/
	function keyDown(e){
		e.preventDefault();
		switch(e.keyCode){
			case 37:
				moveLeft();
				break;
			case 38:
				moveTop();
				break;
			case 39:
				moveRight();
				break;
			case 40:
				moveBottom();
				break;
		}
		$('#score').text(score);
	}


	/*左移*/
	function moveLeft(){
		if(!canMoveLeft()){
			return false;
		}
		for (var i = 0; i < 4; i++) {
			for (var j = 1; j < 4; j++) {
				if(board[i][j]!=0){
					for (var k = 0; k < j; k++) {
						if(board[i][k]==0 && isLeftBarrier(i,j,k,board)){
							/*move*/
							moveNumber(i,j,i,k);
							board[i][k]=board[i][j];
							board[i][j]=0;
							continue;
						}else if(board[i][k]==board[i][j] && isLeftBarrier(i,j,k,board)){
							/*move and add*/
							moveNumber(i,j,i,k);
							board[i][k]+=board[i][j];
							score+=board[i][k];
							board[i][j]=0;
							continue;
						}
					};
				}
			};
		};
		setTimeout(function(){
			updateView();
			rndNumberCell();
			GameOver();
		},200)
		return true;
	}
	/*上移*/
	function moveTop(){
		if(!canMoveTop()){
			return false;
		}
		for (var i = 1; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				if(board[i][j]!=0){
					for (var k = 0; k < i; k++) {
						if(board[k][j]==0 && isTopBarrier(i,j,k,board)){
							/*move*/
							moveNumber(i,j,k,j);
							board[k][j]=board[i][j];
							board[i][j]=0;
							continue;
						}else if(board[k][j]==board[i][j] && isTopBarrier(i,j,k,board)){
							/*move and add*/
							moveNumber(i,j,k,j);
							board[k][j]+=board[i][j];
							score+=board[k][j];
							board[i][j]=0;
							continue;
						}
					};
				}
			};
		};
		setTimeout(function(){
			updateView();
			rndNumberCell();
			GameOver();
		},200)
		return true;
	}
	/*右移*/
	function moveRight(){
		if(!canMoveRight()){
			return false;
		}
		for (var i = 0; i < 4; i++) {
			for (var j = 2; j >-1; j--) {
				if(board[i][j]!=0){
					for (var k = 4; k >j; k--) {
						if(board[i][k]==0 && isRightBarrier(i,j,k,board)){
							/*move*/
							moveNumber(i,j,i,k);
							board[i][k]=board[i][j];
							board[i][j]=0;
							continue;
						}else if(board[i][k]==board[i][j] && isRightBarrier(i,j,k,board)){
							/*move and add*/
							moveNumber(i,j,i,k);
							board[i][k]+=board[i][j];
							score+=board[i][k];
							board[i][j]=0;
							continue;
						}
					};
				}
			};
		};
		setTimeout(function(){
			updateView();
			rndNumberCell();
			GameOver();
		},200)
		return true;
	}
	/*下移*/
	function moveBottom(){
		if(!canMoveBottom()){
			return false;
		}
		for (var i = 2; i >-1; i--) {
			for (var j = 0; j < 4; j++) {
				if(board[i][j]!=0){
					for (var k = 3; k > i; k--) {
						if(board[k][j]==0 && isBottomBarrier(i,j,k,board)){
							/*move*/
							moveNumber(i,j,k,j);
							board[k][j]=board[i][j];
							board[i][j]=0;
							continue;
						}else if(board[k][j]==board[i][j] && isBottomBarrier(i,j,k,board)){
							/*move and add*/
							moveNumber(i,j,k,j);
							board[k][j]+=board[i][j];
							score+=board[k][j];
							board[i][j]=0;
							continue;
						}
					};
				}
			};
		};
		setTimeout(function(){
			updateView();
			rndNumberCell();
			GameOver();
		},200)
		return true;
	}

	/*是否可以左移*/
	function canMoveLeft(){
		for (var i = 0; i < 4; i++) {
			for (var j = 1; j < 4; j++) {
				if(board[i][j]!==0){
					if(board[i][j-1]==0 || board[i][j-1]==board[i][j]){
						return true;
					}
				}
			};
		};
		return false;
	}
	/*是否可以上移*/
	function canMoveTop(){
		for (var i = 1; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				if(board[i][j]!==0){
					if(board[i-1][j]==0 || board[i-1][j]==board[i][j]){
						return true;
					}
				}
			};
		};
		return false;
	}
	/*是否可以右移*/
	function canMoveRight(){
		for (var i = 0; i < 4; i++) {
			for (var j = 2; j > -1; j--) {
				if(board[i][j]!==0){
					if(board[i][j+1]==0 || board[i][j+1]==board[i][j]){
						return true;
					}
				}
			};
		};
		return false;
	}
	/*是否可以下移*/
	function canMoveBottom(){
		for (var i = 2; i > -1; i--) {
			for (var j = 0; j < 4; j++) {
				if(board[i][j]!==0){
					if(board[i+1][j]==0 || board[i+1][j]==board[i][j]){
						return true;
					}
				}
			};
		};
		return false;
	}

	/*判断左面障碍物*/
	function isLeftBarrier(i,j,k,board){
		for (var n = k+1; n < j; n++){
			if(board[i][n]!==0)
				return false;
		}
		return true;
	}
	/*判断上面障碍物*/
	function isTopBarrier(i,j,k,board){
		for (var n = k+1; n < i; n++){
			if(board[n][j]!==0)
				return false;
		}
		return true;
	}
	/*判断右面障碍物*/
	function isRightBarrier(i,j,k,board){
		for (var n = j+1; n < k; n++){
			if(board[i][n]!==0)
				return false;
		}
		return true;
	}
	/*判断下面障碍物*/
	function isBottomBarrier(i,j,k,board){
		for (var n = i+1; n < k; n++){
			if(board[n][j]!==0)
				return false;
		}
		return true;
	}

	/*游戏是否结束*/
	function GameOver(){
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				if(board[i][j]==0){
					return ;
				}
			};
		};
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 3; j++) {
				if(board[i][j]==board[i][j+1]){
					return ;
				}
			};
		};
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 4; j++) {
				if(board[i][j]==board[i+1][j]){
					return ;
				}
			};
		};
		
		$('.page').animate({
			opacity:0.7
		});;
		$(document).unbind('keydown',keyDown);
	}

	/*运动移动*/
	function moveNumber(formi,formj,toi,toj){
		$('#number-cell-'+formi+'-'+formj).animate({
			left:getPos(toi,toj).left,
			top:getPos(toi,toj).top
		},{duration:200});
	}


	function setStyle(){
		if(clientWidth>500){
			clientWidth=500;
		}

		boxWidth=clientWidth*0.96;
		cellWidth=boxWidth*0.2;
		marginWidth=clientWidth*0.04;

		container.css({
			width:boxWidth,
			height:boxWidth,
			fontSize:cellWidth/2
		});

		container.find('.grid-cell').css({
			width:cellWidth,
			height:cellWidth
		});

	}

})

