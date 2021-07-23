var video = document.getElementById('video');
var canvas = document.getElementById('canvas');
var context_canvas = canvas.getContext('2d');
var minY;
var canvas_width = 320;
var canvas_height = 240; 
var squares;

var step = 5;
var worker = new Worker('calc.js');
var timer_video;

worker.addEventListener('message', function(e) {
    //console.log(e.data);
    switch(e.data.status){
     case 'ok':

      if(e.data.squares){
           var sheet = new EasyC(canvas, [
    		  {
    			type: "rectangle",
    			x: parseInt(e.data.squares.left),
    			y: parseInt(e.data.squares.up),
    			width: 15,
  				height: 15,
  				//fill: "#000",
  				stroke: { fill: "#ffdc03", thick: 3},
    			z: 25
  		     }]);
   		 sheet.draw();	

		  
	  }
    break;

   }
    
  }, false);


// Получаем доступ к камере
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Не включаем аудио опцией `{ audio: true }` поскольку сейчас мы работаем только с изображениями
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        video.srcObject = stream;
        video.play();
    });
}


document.getElementById("getcolors").addEventListener("click", function() {
	$("#getcolors").attr('disabled',true);
	$("#stopcolors").attr('disabled',false);
	timer_video = setInterval(function(){
		context_canvas.drawImage(video, 0, 0, canvas_width, canvas_height);	
		worker.postMessage({'cmd': 'calc_colors', 'data_calc': {step: step,canvas_height: canvas_height,canvas_width: canvas_width,canvas_data: context_canvas.getImageData(0, 0, canvas.width, canvas.height)}});
	},1000/30);
});

document.getElementById("stopcolors").addEventListener("click", function() {
	$("#getcolors").attr('disabled',false);
	$("#stopcolors").attr('disabled',true);
	clearInterval(timer_video);
});