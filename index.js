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
				commentList[i] = comment
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
		li.setAttribute("style", "list-style-type: none")

		// main div for the li element
		var mainDiv = document.createElement("div");

		//commentDiv which will have comment and username
		var commentDetailDiv = document.createElement("div");

		var commentNameDiv = document.createElement("div");
		
		var commentPic = document.createElement("img");
		var imagelocpro = "images/avatar1.png";
		commentPic.setAttribute("src", imagelocpro);
		commentPic.setAttribute("height", "50px");
		commentPic.setAttribute("width", "50px");
		commentPic.setAttribute("style", "margin-right: 10px; border-radius: 5px");

		var commentName = document.createTextNode(comment.userName);
		var commenTime = document.createTextNode(comment.commentTime);
		commentNameDiv.setAttribute("style", "font-weight: normal; font-size: 25px; font-family: Times");

		var commentTextDiv = document.createElement("div");
		var commentText = document.createTextNode(comment.text);
		commentTextDiv.setAttribute("style", "font-weight: normal; font-family: verdana")

		commentNameDiv.appendChild(commentPic)
		commentNameDiv.appendChild(commentName)
		commentNameDiv.appendChild(commenTime)
		commentTextDiv.appendChild(commentText)

		// votes div which will have votes along with upvote and downvote
		var likesDiv  = document.createElement("div");
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

		var replyBtn = document.createElement("button")
		replyBtn.innerHTML = 'Reply';
		replyBtn.setAttribute("style", "width: 6.5vw; height: 6vh; background: #24343d; color: white; border-radius: 1.5vh; text-decoration: none; border: none")
		replyBtn.onclick = function(){
			replyBtn.style.cssText = 'display:none';
			hiddenReplyDiv.style.cssText = 'display:block';
		}
		
		likesDiv.appendChild(likes);
		likesDiv.appendChild(likePic);
		likesDiv.appendChild(dislikePic);
		likesDiv.appendChild(replyBtn);

		//reply username div
		var userNameDiv = document.createElement("div")
		var userName = document.createTextNode("Username:")
		var usernameInput = document.createElement("input");
		usernameInput.setAttribute("style", "width: 96%; height: 2.5vh; padding: 3px;")
		userNameDiv.appendChild(userName)
		userNameDiv.appendChild(usernameInput)

		// reply comment div
		var replyCommentLabelDiv = document.createElement("div");
		var commentText = document.createTextNode("Comment:");
		replyCommentLabelDiv.appendChild(commentText);


		var replyCommentDiv = document.createElement("div");
		var commentInput = document.createElement("textarea");
		commentInput.setAttribute("style", "height: 12vh; padding: 3px; width: 95%;");
		
		replyCommentDiv.appendChild(commentInput);

		//reply post button which will create a new comment
		
		var postReplyBtn = document.createElement("button")
		postReplyBtn.innerHTML = "POST"
		postReplyBtn.setAttribute("style", "width: 6.5vw; height: 6vh; background: #24343d; color: white; border-radius: 1.5vh; float: right; margin-right: 1.2vw; text-decoration: none; border: none")
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
		
		var hiddenReplyDiv = document.createElement("div")
		hiddenReplyDiv.style.cssText = 'display:none';
		hiddenReplyDiv.appendChild(userNameDiv)
		hiddenReplyDiv.appendChild(replyCommentLabelDiv)
		hiddenReplyDiv.appendChild(replyCommentDiv)
		hiddenReplyDiv.appendChild(postReplyBtn)



		replyDiv.appendChild(hiddenReplyDiv);

		
		mainDiv.appendChild(commentNameDiv)
		mainDiv.appendChild(commentTextDiv)
		mainDiv.appendChild(likesDiv)
		mainDiv.appendChild(replyDiv)
		li.appendChild(mainDiv)
		return li;
	}

	document.getElementById('post').addEventListener('click',function(){
		var userName = document.getElementById('userName').value;
		var content = document.getElementById('joinDiscussion').value;

		createComment(userName,content,0)
	})

	var commentList = JSON.parse(window.localStorage.getItem('commentList'))||[];
	if(commentList.length)
		createCommentView(commentList)

})()