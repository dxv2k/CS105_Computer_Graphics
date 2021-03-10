#include "pch.h"
#include "Bresenham.h"

void lineBresenham1(CDC* pDC, COLORREF color,
	int x1, int y1,
	int x2, int y2) {

	int deltaX = x2 - x1; 
	int deltaY = y2 - y1; 

	int yStep = (deltaY >= 0) ? 1 : -1; 

	deltaX = abs(deltaX); 
	deltaY = abs(deltaY); 

	int const1 = deltaY << 1; 
	int const2 = (deltaY-deltaX) << 1; 
	
	int p = const1 - deltaX; 
	pDC->SetPixel(y1, y1, color); 

	//for (int i = 0 ; i < deltaX; i++) {
	for (; x1 < x2; ) {
		if (p < 0) {
			p += const1; 
		} 
		else {
			p += const2; 
			y1 += yStep; 
		} 
		x1++; 
		pDC->SetPixel(x1,y1,color);
	}
}

void lineBresenham2(CDC* pDC, COLORREF color,
	int x1, int y1,
	int x2, int y2) {

	int deltaX = x2 - x1; 
	int deltaY = y2 - y1; 

	deltaX = abs(deltaX); 
	deltaY = abs(deltaY); 

	int const1 = deltaX << 1; 
	int const2 = (deltaY-deltaX) << 1; 
	
	int p = const1 - deltaY; 
	pDC->SetPixel(y1, y1, color); 

	for (; y1 < y2; ) {
		if (p < 0) {
			p += const1; 
			y1++; 
		} 
		else {
			p += const2; 
			x1++; 
			y1++; 
		} 
		pDC->SetPixel(x1,y1,color);
	}
}

