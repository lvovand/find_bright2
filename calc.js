var canvas_data; //данные из канвас
var width; //ширина канвас     
var height; //высота канвас
var squares; //массив областей 

var current_x;
var current_y;

self.addEventListener('message', function(e) {
  var data = e.data;
  switch (data.cmd) {
    case 'calc_colors':
      canvas_data = data.data_calc.canvas_data;
      width = data.data_calc.canvas_width;      
      height = data.data_calc.canvas_height;
      var squares = calculate(data.data_calc); // Функция, вычисляющая области
      self.postMessage({status: 'ok',squares: squares}); //отправляем сообщение с найденными областями
      break;
    default:
      self.postMessage('Unknown command');
  }
}, false);


//информация по пикселю
function getPixel(x, y) {
		if (x < 0) { x = 0; }
		if (y < 0) { y = 0; }
		if (x >= width) { x = width - 1; }
		if (y >= height) { y = height - 1; }
		var index = (y * width + x) * 4;
		return [
			canvas_data.data[index + 0],
			canvas_data.data[index + 1],
			canvas_data.data[index + 2],
			canvas_data.data[index + 3],
    		];
}
	
//получаем яркость	
function getYarkost(R=0,G=0,B=0){
	var Y = 0.2126*R + 0.7152*G + 0.0722*B; //Фотометрический/цифровой ITU BT.709:
	return(Y);
}
	
//поиск ярких областей	
function calculate(data_calc){	
	var step = parseInt(data_calc.step);
	var canvas_height = parseInt(data_calc.canvas_height);
	var canvas_width = parseInt(data_calc.canvas_width);
	var minY = 0;
	var min_width = 10;
	var min_height = 10;
	squares = [];
		var i=0;
		var pixels_get = 1; //кол-во пройденных пикселей
	//console.log(data_calc.canvas_height,data_calc.canvas_width,data_calc.step);	
	for(var y=0; y<canvas_height; y+=step){
		for(var x=0; x<canvas_width; x+=step){
			pixels_get++;
			
			var rgba = getPixel(x, y);
			
			//получить яркость точки
			var Y = getYarkost(rgba[0],rgba[1],rgba[2]);
			//console.log(Math.floor(Y));
			if (Math.floor(Y) == 255) {
				var left = (x > min_width)? x-min_width/2 : x;
				var up = (y > min_height)? y-min_width/2 : y; 
				var right = left + min_width;
				var down = up + min_height; 
				//squares.push({left: left, up: up,right: right,down: down});	
				//return(squares);
				return({left: left, up: up,right: right,down: down});		
			}	   
         if(Y>minY){
           minY = Y;	
			  current_x = x;
			  current_y = y;	         
         }
		}				
	}
	//console.log(current_x,current_y,minY);
	var left = (current_x > min_width)? current_x-min_width/2 : current_x;
	var up = current_y; 
	var right = left + min_width;
	var down = up + min_height; 
	//squares.push({left: left, up: up,right: right,down: down});	
	//return(squares);
	return({left: left, up: up,right: right,down: down});
}