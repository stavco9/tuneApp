function randomMergeArrays(array1, array2, chanceTo1 = 0.5, mergedArraySize = 0) {
	let mergedArray = [];
	if(mergedArraySize == 0) {
		mergedArraySize = array1.length + array2.length;
	}

	[i1, i2] = [0, 0];
	for(let i=0; i<mergedArraySize; i++) {
		if((Math.random() <= chanceTo1 && i1 < array1.length) || i2 == array2.length) {
			mergedArray.push(array1[i1]);
			i1++;
		}
		else {
			mergedArray.push(array2[i2]);
			i2++;
		}
	}

	return mergedArray;
}

function shuffleArray(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

module.exports = {
    shuffleArray,
    randomMergeArrays
}