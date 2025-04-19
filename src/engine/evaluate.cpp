#include <emscripten.h>
#include <cmath>
#include <stdio.h>

extern "C" {

	inline float func(float x, float y) {
		// float sqAbsX = std::sqrt(std::abs(x));
		// float sqAbsY = std::sqrt(std::abs(y));
		// return (x*std::sin(sqAbsX)+y*std::sin(sqAbsY))/6;

		return (x*x+y*y) / 100.0;

		// return powf(std::abs(x/10), 1.4) + powf(std::abs(y/10), 1.2);

		// return (x*std::sin(x)+y*std::sin(y))/10;
	}

	EMSCRIPTEN_KEEPALIVE void eval_chunk(float* outArr, float x1, float x2, float y1, float y2, int resolution) {
		float xstep = (x2-x1) / (resolution-1);
		float ystep = (y2-y1) / (resolution-1);

		for (int r = -1; ++r < resolution;) {
			for (int c = -1; ++c < resolution;) {
				// order is weird cuz we change x,y,z (math) -> x,z,y (render)
				float x = x1+c*xstep;
				float y = y2-r*ystep;

				outArr[3*(r*resolution+c)] = x;
				outArr[3*(r*resolution+c)+2] = y;
				outArr[3*(r*resolution+c)+1] = func(x,y);
			}
		}

		/*
		for (int i = 0; i < 10; i++) {
			printf("%f ", outArr[i]);
		}
		printf("\n");
		*/
	}
}


/*
}

#include <emscripten/bind.h>
#include <vector>
#include <cmath>

using std::vector;

inline float func(float x, float y) {
    return (sin(sqrt(abs(5*x)))*x+cos(sqrt(abs(5*y)))*y)/5;
}

vector<float> eval_chunk(float x1, float x2, float y1, float y2, int resolution) {
	vector<float> outArr(resolution*resolution);
	float xstep = (x2-x1) / (resolution-1);
	float ystep = (y2-y1) / (resolution-1);

	for (int r = -1; ++r < resolution;) {
		for (int c = -1; ++c < resolution;) {
			// order is weird cuz we change x,y,z (math) -> x,z,y (render)
			float x = x1+c*xstep;
			float y = y2-r*ystep;

			outArr[3*(r*resolution+c)] = x;
			outArr[3*(r*resolution+c)+2] = y;
			outArr[3*(r*resolution+c)+1] = func(x,y);
		}
	}
	return outArr;
}

void testfunclol(float *x) {
	*x = 4.0f;
}

EMSCRIPTEN_BINDINGS(my_module) {
  // emscripten::function("eval_chunk", &eval_chunk);
	emscripten::function("testfunclol", &testfunclol);
}
*/