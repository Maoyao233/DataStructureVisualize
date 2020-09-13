// 冒泡排序方法，返回包括每一步的数组
function bubbleSort(values) {

    // sequence 为包括每一步内容的数组
    let sequence = [];
    // swapped 为判断是否已经排序好的 标志位
    let swapped;
    // indexLastUnsorted 用来减少不必要的循环
    let indexLastUnsorted = values.length - 1;

    do {
        swapped = false;
        for (let i = 0; i < indexLastUnsorted; i++) {
            sequence.push({ type: "activate", indexes: [i, i + 1] });

            if (values[i] > values[i + 1]) {
                let temp = values[i];
                values[i] = values[i + 1];
                values[i + 1] = temp;
                swapped = true;
                sequence.push({ type: "swap", indexes: [i, i + 1] });
            }

            sequence.push({ type: "deactivate", indexes: [i, i + 1] });
        }

        sequence.push({ type: "lock", indexes: [indexLastUnsorted] });
        indexLastUnsorted--;
    } while (swapped);

    // 如果提前排序好了，把剩下的card全部锁定
    let skipped = Array.from(Array(indexLastUnsorted + 1).keys());
    sequence.push({ type: "lock", indexes: skipped });

    return sequence;
}

//简单插入排序
function insertionSort(values) {
    let sequence = [];
    sequence.push({ type: "lock", indexes: [0] });
    for (let i = 1; i < values.length; i++) {
        let p = i;
        let j;
        for (j = i - 1; j >= 0; j--) {
            sequence.push({ type: "activate", indexes: [j, i] });
            sequence.push({ type: "deactivate", indexes: [j, i] });
            if (values[j] > values[i]) {
                p = j;
            } else {
                break;
            }
        }
        if (p < i) {
            sequence.push({ type: "insert_to_front", indexes: [i, p] });
            let t = values[i];
            for (let j = i - 1; j >= p; j--) {
                values[j + 1] = values[j];
            }
            values[p] = t;
        }
        sequence.push({ type: "lock", indexes: [p] });
    }
    return sequence;
}

//二分插入排序
function binaryInsertionSort(values) {

    let sequence = [];
    sequence.push({ type: "lock", indexes: [0] });
    for (let i = 1; i < values.length; i++) {
        let l = 0,
            r = i;
        while (l < r) {
            let mid = parseInt((l + r) / 2);
            sequence.push({ type: "activate", indexes: [mid, i] });
            sequence.push({ type: "deactivate", indexes: [mid, i] });
            if (values[mid] < values[i]) {
                l = mid + 1;
            } else {
                r = mid;
            }
        }
        if (l < i) {
            sequence.push({ type: "insert_to_front", indexes: [i, l] });
            let t = values[i];
            for (let j = i - 1; j >= l; j--) {
                values[j + 1] = values[j];
            }
            values[l] = t;
        }
        sequence.push({ type: "lock", indexes: [l] });
    }
    return sequence;
}

//希尔排序
function shellSort(values) {

    let sequence = [];
    let len = values.length;
    //获取增量序列
    let gap = 1;
    while (gap < len / 3) {
        gap = gap * 3 + 1;
    }
    //分组插入排序
    while (gap > 1) {
        for (let i = 0; i < len; i++) {
            for (let j = i; j >= gap; j -= gap) {
                sequence.push({ type: "activate", indexes: [j, j - gap] });
                sequence.push({ type: "deactivate", indexes: [j, j - gap] });
                if (values[j] < values[j - gap]) {
                    sequence.push({ type: "swap", indexes: [j, j - gap] });
                    let temp = values[j - gap];
                    values[j - gap] = values[j];
                    values[j] = temp;
                } else {
                    break;
                }
            }
        }
        gap = (gap - 1) / 3;
    }
    //最后一趟，gap=1时等价于对整个数组插入排序，因此直接复用二分插入排序的代码
    sequence = sequence.concat(binaryInsertionSort(values));
    return sequence;
}

function selectionSort(values) {


    let sequence = [];
    for (let i = 0; i < values.length - 1; i++) {
        let minPos = i;
        for (let j = i + 1; j < values.length; j++) {
            sequence.push({ type: "activate", indexes: [minPos, j] });
            if (values[j] < values[minPos]) {
                sequence.push({ type: "deactivate", indexes: [minPos] });
                minPos = j;
            } else {
                sequence.push({ type: "deactivate", indexes: [j] });
            }
        }
        sequence.push({ type: "deactivate", indexes: [minPos] });
        if (minPos != i) {
            sequence.push({ type: "swap", indexes: [i, minPos] });
            let tmp = values[i];
            values[i] = values[minPos];
            values[minPos] = tmp;
        }
        sequence.push({ type: "lock", indexes: [i] });
    }
    sequence.push({ type: "lock", indexes: [values.length - 1] });
    return sequence;
}

function quickSort(values) {
    let sequence = [];
    quickSortRecursive(0, values.length);
    return sequence;

    function quickSortRecursive(begin, end) {
        if (end - begin <= 1) {
            if (begin < values.length) {
                sequence.push({ type: "lock", indexes: [begin] });
            }
            return;
        }
        let pivot = values[begin];
        let i = begin;
        let j = end - 1;
        while (i < j) {
            while (i < j) {
                sequence.push({ type: "activate", indexes: [begin, j] });
                sequence.push({ type: "deactivate", indexes: [begin, j] });
                if (values[j] >= pivot) {
                    j--;
                } else {
                    break;
                }
            }
            while (i < j) {
                sequence.push({ type: "activate", indexes: [begin, i] });
                sequence.push({ type: "deactivate", indexes: [begin, i] });
                if (values[i] <= pivot) {
                    i++;
                } else {
                    break;
                }
            }
            if (i < j) {
                sequence.push({ type: "swap", indexes: [i, j] });
                let t = values[i];
                values[i] = values[j];
                values[j] = t;
            }
        }
        sequence.push({ type: "swap", indexes: [begin, i] });
        values[begin] = values[i];
        values[i] = pivot;
        sequence.push({ type: "lock", indexes: [i] });
        quickSortRecursive(begin, i);
        quickSortRecursive(i + 1, end);
    }
}

export { bubbleSort, insertionSort, binaryInsertionSort, shellSort, quickSort, selectionSort };