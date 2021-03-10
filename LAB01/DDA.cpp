#include "pch.h"
#include "DDA.h"
#define Round(x) (int) (x+0.5) 

//void LineDDA1(CDC *pDC, COLORREF color, 
//	int x1, int y1, // start coordinate of line  
//	int x2, int y2  // end coordinate of line 
//) {
//	pDC->SetPixel(x1,y1, color); 
//	float m = (y2 - y1) * 1.0 / (x2 - x1); 
//
//	int x = x1; 
//	int y = y1; 
//	for (; x < x2;) {
//		x = x + 1; 
//		y = y + m; 
//		y = Round(y); 
//		pDC->SetPixel(x,y,color); 
//	}
//}
void LineDDA1(CDC* pDC, COLORREF color,
	int x1, int y1, // start coordinate of line  
	int x2, int y2  // end coordinate of line 
) {
	pDC->SetPixel(x1,y1,color); 
	float m = (float)(y2-y1) / (x2-x1); 
	float y = y1; 
	while (x1 < x2) {
		x1++; 
		y += m; 
		pDC->SetPixel(x1, Round(y), color); 
	}
}



// ERROR: DDA2 not working, not render on scrn 
//void LineDDA2(CDC *pDC, COLORREF color, 
//	int x1, int y1, // start coordinate of line  
//	int x2, int y2  // end coordinate of line 
//) {
//	pDC->SetPixel(x1,y1, color); 
//	float m = float(x2 - x1) / (y2 - y1); 
//	float x = x1; 
//	float y = y1; 
//	for (; y < y2;) {
//		y++; 
//		x += m; 
//		x = Round(x); 
//		pDC->SetPixel(x,y,color); 
//	}
//}


void LineDDA2(CDC* pDC, COLORREF color,
	int x1, int y1,
	int x2, int y2) {
	pDC->SetPixel(x1, y1, color); 
	//float m = (float)(x2 - x1) / (y2 - y1); 
	float m = (x2 - x1) / (y2 - y1); 
	float x = x1; 
	while(y1 < y2){ 
		y1++; 
		x += m; 
		//pDC->SetPixel(Round(x), y1, color); 
		pDC->SetPixel(x, y1, color); 
	}
}

