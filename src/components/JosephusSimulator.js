function simulateJosephus(n, s) {
    let sequence = [];

    let players = new Array(n);

    for (let i = 0; i < n; i++) {
        players[i] = {
            index: i,
            number: i + 1
        };
    }

    for (let i = 0; i < n; i++) {
        players[i].prior = players[(i - 1 + n) % n];
        players[i].next = players[(i + 1) % n]
    }

    let cursor = players[s];
    let aliveCnt = n;
    while (aliveCnt > 1) {
        let k = Math.floor(Math.random() * 6 + 1);
        sequence.push({
            type: "Josephus/random",
            number: k
        })
        for (let i = 1; i < k; i++) {
            sequence.push({
                type: "Josephus/activate",
                indexes: [cursor.index]
            })
            sequence.push({
                type: "Josephus/deactivate",
                indexes: [cursor.index]
            });
            cursor = cursor.next;
        }
        sequence.push({
            type: "Josephus/danger",
            indexes: [cursor.index]
        })
        sequence.push({
            type: "Josephus/kill",
            indexes: [cursor.index]
        });
        cursor.prior.next = cursor.next;
        cursor.next.prior = cursor.prior;
        cursor = cursor.next;
        aliveCnt--;
    }
    console.log(sequence);
    return sequence;
}

export default simulateJosephus;