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
		commentList = findAndUpdateComment(commentList,this)
		createCommentView(commentList);
	}

	CurrentComment.prototype.dislike = function(){
		var commentList = JSON.parse(window.localStorage.getItem('commentList'))||[];
		if(this.votes > 0)
			this.votes = this.votes - 1;
		commentList = findAndUpdateComment(commentList,this)
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

	CurrentComment.prototype.updateReplyList = function(){
		var commentList = JSON.parse(window.localStorage.getItem('commentList'))||[];
		commentList = findAndUpdateComment(commentList,this)
		createCommentView(commentList)
	}

	function findAndUpdateComment(commentList,comment){
		for(var i = 0; i < commentList.length; i++){
			if(commentList[i].text == comment.text && commentList[i].userName == comment.userName)
				commentList[i] = comment;
			if(commentList[i].commentList.length > 0)
				findAndUpdateComment(commentList[i].commentList,comment)
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
		var mainUL = document.createElement("ul");
		console.log("commentList", commentList)
		for(var i = 0; i < commentList.length; i++){
			var comment = new CurrentComment(commentList[i].userName,commentList[i].text,commentList[i].votes,commentList[i].commentList,commentList[i].commentTime)	
			console.log('showComment - comment', comment);
			var li = addCommentBox(comment,i)
			mainUL.appendChild(li)
			if(commentList[i].commentList.length > 0){
				mainUL.appendChild(showComments(commentList[i].commentList))
			}
		}
		return mainUL
	}

	function addCommentBox(comment,index){
		// main li element
		var li = document.createElement("li");
		li.setAttribute("style", "list-style-type: none");

		var completeComment  = document.createElement("div");
		completeComment.setAttribute("style", "border-top: 1px solid black; padding-top: 1.2vh")

		// main div for the li element
		var mainDiv = document.createElement("div");

		//commentDiv which will have comment and username
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

		// votes div which will have votes along with upvote and downvote
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
		
		timeDiv.appendChild(commentTime);
		
		otherOpDiv.appendChild(likes);
		otherOpDiv.appendChild(likePic);
		otherOpDiv.appendChild(dislikePic);
		otherOpDiv.appendChild(replyBtn);

		likesDiv.appendChild(timeDiv);
		likesDiv.appendChild(otherOpDiv);

		//reply username div
		var userNameDiv = document.createElement("div")
		// var userName = document.createTextNode("Username:")
		var usernameInput = document.createElement("input");
		usernameInput.setAttribute("style", "width: 96%; height: 2.5vh; padding: 3px;"	)
		usernameInput.setAttribute("placeholder", "Enter your username")
		// userNameDiv.appendChild(userName)
		userNameDiv.appendChild(usernameInput)

		// reply comment div
		var replyCommentLabelDiv = document.createElement("div");
		var commentText = document.createTextNode("Comment:");
		replyCommentLabelDiv.appendChild(commentText);


		var replyCommentDiv = document.createElement("div");
		var commentInput = document.createElement("textarea");
		commentInput.setAttribute("style", "height: 12vh; padding: 3px; width: 95%;");
		
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
			comment.updateReplyList();
		}

		// reply Div which will show up on click of reply button
		var replyDiv = document.createElement("div");
		replyDiv.setAttribute("style", "padding: 2vh;")

		var backBtn = document.createElement("button")
		backBtn.innerHTML = "back";
		backBtn.onClick = function(){
			console.log("back clicked");
			// hiddenReplyDiv.style.cssText = 'display:none';

		} 
		
		var hiddenReplyDiv = document.createElement("div")
		hiddenReplyDiv.style.cssText = 'display:none';
		hiddenReplyDiv.appendChild(userNameDiv)
		hiddenReplyDiv.appendChild(replyCommentLabelDiv)
		hiddenReplyDiv.appendChild(replyCommentDiv)
		hiddenReplyDiv.appendChild(postReplyBtn)
		hiddenReplyDiv.appendChild(backBtn)



		replyDiv.appendChild(hiddenReplyDiv);

		
		// mainDiv.appendChild(commentNameDiv)
		// mainDiv.appendChild(commentTextDiv)
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
		var currentTime = Date.now();

		createComment(userName,content,0,currentTime);
	})

	var commentList = JSON.parse(window.localStorage.getItem('commentList'))||[];
	if(commentList.length)
		createCommentView(commentList)

})()