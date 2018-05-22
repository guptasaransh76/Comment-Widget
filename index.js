( function(){

	function CurrentComment(userName,text,votes,commentList,commentTime){
		this.userName = userName;
		this.text = text;
		this.votes = votes;
		this.commentList = commentList;
		this.commentTime = commentTime
	}

	CurrentComment.prototype.like = function(){
		var commentList = JSON.parse(window.localStorage.getItem('commentList'))||[];
		this.votes = this.votes + 1;
		commentList = searchAndCommentUpdate(commentList,this)
		createCommentView(commentList);
	}

	CurrentComment.prototype.dislike = function(){
		var commentList = JSON.parse(window.localStorage.getItem('commentList'))||[];
		if(this.votes > 0)
			this.votes = this.votes - 1;
		commentList = searchAndCommentUpdate(commentList,this)
		createCommentView(commentList);
	}

	CurrentComment.prototype.reply = function(userName,text){
		var reply = new currentComment(userName,text,0,[],commentTime);
		this.commentList.push(reply)
	}

	CurrentComment.prototype.save = function(){
		var commentList = JSON.parse(window.localStorage.getItem('commentList'))||[];
		commentList.push(this);
		createCommentView(commentList);
	}

	CurrentComment.prototype.replyListUpdate = function(){
		var commentList = JSON.parse(window.localStorage.getItem('commentList'))||[];
		commentList = searchAndCommentUpdate(commentList,this)
		createCommentView(commentList)
	}

	function searchAndCommentUpdate(commentList,comment){
		for(var i = 0; i < commentList.length; i++){
			if(commentList[i].text == comment.text && commentList[i].userName == comment.userName)
				commentList[i] = comment;
			if(commentList[i].commentList.length > 0)
				searchAndCommentUpdate(commentList[i].commentList,comment)
		}
		return commentList;
	}

	function createCommentView(commentList){
		var documentFragment = document.createDocumentFragment();
		documentFragment.appendChild(showComments(commentList));
		document.getElementById('viewComments').innerHTML = "";
		document.getElementById('viewComments').appendChild(documentFragment);
		window.localStorage.setItem('commentList',JSON.stringify(commentList));

	}

	function createComment(userName,text,votes,commentTime){
		var comment = new CurrentComment(userName,text,votes,[],commentTime);
		comment.save();
		return comment;
	}

	function showComments(commentList){
		var mainList = document.createElement("ul");
		
		for(var i = 0; i < commentList.length; i++){
			var comment = new CurrentComment(commentList[i].userName,commentList[i].text,commentList[i].votes,commentList[i].commentList,commentList[i].commentTime)	
			
			var listItem = addCommentBox(comment,i)
			mainList.appendChild(listItem)
			if(commentList[i].commentList.length > 0){
				mainList.appendChild(showComments(commentList[i].commentList))
			}
		}
		return mainList;
	}

	function addCommentBox(comment,index){
		var li = document.createElement("li");
		li.setAttribute("style", "list-style-type: none");

		var completeComment  = document.createElement("div");
		completeComment.setAttribute("style", "border-top: 1px solid black; padding-top: 1.2vh; margin-top: 5vh")

		var mainDiv = document.createElement("div");

		var commentDetailDiv = document.createElement("div");
		commentDetailDiv.setAttribute("style", "border-bottom: 1px solid black");

		var commentNameDiv = document.createElement("div");
		
		var commentPicDiv = document.createElement("div");
		commentPicDiv.setAttribute("style", "float: left; height: auto");

		var commentPic = document.createElement("img");
		var imagelocpro = "images/avatar1.png";
		commentPic.setAttribute("src", imagelocpro);
		commentPic.setAttribute("height", "45vh");
		commentPic.setAttribute("width", "45vw");
		commentPic.setAttribute("style", "margin-right: 10px; border-radius: 5px");

		var commentName = document.createTextNode(comment.userName);
		
		commentNameDiv.setAttribute("style", "font-weight: bold; font-size: 18px; font-family: Times; padding: 0.6vh");

		var commentTextDiv = document.createElement("div");
		var commentText = document.createTextNode(comment.text);
		commentTextDiv.setAttribute("style", "font-weight: normal; font-family: verdana; font-size: 15px;")

		commentDetailDiv.appendChild(commentPicDiv);
		commentDetailDiv.appendChild(commentNameDiv);
		commentDetailDiv.appendChild(commentTextDiv);


		commentPicDiv.appendChild(commentPic)
		commentNameDiv.appendChild(commentName)
		commentTextDiv.appendChild(commentText)

		var likesDiv  = document.createElement("div");
		likesDiv.setAttribute("style", "margin-top: 0.5vh");

		var timeDiv  = document.createElement("div");
		timeDiv.setAttribute("style", "float: right;");
		
		var otherOpDiv  = document.createElement("div");
		otherOpDiv.setAttribute("style", "margin-top: 1vh")

		var likes = document.createTextNode(comment.votes);
	
		var likePic = document.createElement('img');
		var imageloclike = "images/like.png";
		likePic.setAttribute("src", imageloclike);
		likePic.setAttribute("height", "15px");
		likePic.setAttribute("width", "15px");
		likePic.setAttribute("style", "margin-left: 15px");
		likePic.onclick = function(){
			comment.like();
		}
		
		var dislikePic = document.createElement('img');
		var imagelocdislike = "images/dislike.png";
		dislikePic.setAttribute("src", imagelocdislike);
		dislikePic.setAttribute("height", "15px");
		dislikePic.setAttribute("width", "15px");
		dislikePic.setAttribute("style", "margin-left: 15px;");
		dislikePic.onclick = function(){
			comment.dislike();
		}

		var commentTime = document.createTextNode(comment.commentTime);

		var replyBtn = document.createElement("button")
		replyBtn.innerHTML = 'Reply';
		replyBtn.setAttribute("style", "width: 6vw; height: 3.5vh; background: #24343d; color: white; border-radius: 1.5vh; text-decoration: none; border: none; margin-left: 5vw")
		replyBtn.onclick = function(){
			replyBtn.style.cssText = 'display:none';
			hiddenReplyDiv.style.cssText = 'display:block';
		}

		var time = commentTime.data;
		var timeStr = new Date(time).toLocaleString();

		timeDiv.innerHTML = "Posted on: " + timeStr.toString();
		
		otherOpDiv.appendChild(likes);
		otherOpDiv.appendChild(likePic);
		otherOpDiv.appendChild(dislikePic);
		otherOpDiv.appendChild(replyBtn);

		likesDiv.appendChild(timeDiv);
		likesDiv.appendChild(otherOpDiv);

		var userNameDiv = document.createElement("div")
		var usernameInput = document.createElement("input");
		usernameInput.setAttribute("style", "width: 96%; height: 2.5vh; padding: 3px;")
		usernameInput.setAttribute("placeholder", "Enter your username")
		userNameDiv.appendChild(usernameInput)

		var replyCommentLabelDiv = document.createElement("div");
		var commentText = document.createTextNode("Comment:");
		replyCommentLabelDiv.appendChild(commentText);


		var replyCommentDiv = document.createElement("div");
		var commentInput = document.createElement("textarea");
		commentInput.setAttribute("style", "height: 12vh; padding: 3px; width: 96%;");
		
		replyCommentDiv.appendChild(commentInput);

		
		var postReplyBtn = document.createElement("button")
		postReplyBtn.innerHTML = "POST"
		postReplyBtn.setAttribute("style", "width: 6vw; height: 4vh; background: #24343d; color: white; border-radius: 1.5vh; float: right; margin-right: 1.2vw; text-decoration: none; border: none; margin-top: 0.7vh;")
		postReplyBtn.onclick = function(){
			var content = commentInput.value;
			var user = usernameInput.value;
			var commentTime = new Date();
			var reply = new CurrentComment(user,content,0,[],commentTime);
			comment.commentList.push(reply);
			comment.replyListUpdate();
		}

		var replyDiv = document.createElement("div");
		replyDiv.setAttribute("style", "padding: 2vh;")
		
		var hiddenReplyDiv = document.createElement("div")
		hiddenReplyDiv.style.cssText = 'display:none';
		hiddenReplyDiv.appendChild(userNameDiv)
		hiddenReplyDiv.appendChild(replyCommentLabelDiv)
		hiddenReplyDiv.appendChild(replyCommentDiv)
		hiddenReplyDiv.appendChild(postReplyBtn)


		replyDiv.appendChild(hiddenReplyDiv);

		mainDiv.appendChild(commentDetailDiv)
		mainDiv.appendChild(likesDiv)
		mainDiv.appendChild(replyDiv)
		completeComment.appendChild(mainDiv)
		li.appendChild(completeComment)
		return li;
	}

	document.getElementById('post').addEventListener('click',function(){
		var userName = document.getElementById('userName').value;
		var content = document.getElementById('joinDiscussion').value;
		var commentTime = Date();

		createComment(userName,content,0,commentTime);
	})

	var commentList = JSON.parse(window.localStorage.getItem('commentList'))||[];
	if(commentList.length)
		createCommentView(commentList)

})()