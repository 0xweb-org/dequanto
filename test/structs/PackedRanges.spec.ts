import { PackedRanges } from '@dequanto/class/PackedRanges';

UTest({
    'adding numbers' () {
        let tracker = new PackedRanges({
            ranges: [[1,100]]
        });

        tracker.add(101);
        deepEq_(tracker['ranges'], [[1, 101]])

        tracker['ranges'] = [[5,100]];
        tracker.add(4);
        deepEq_(tracker['ranges'], [[4, 100]])

        tracker['ranges'] = [[1,100]];
        tracker.add(102);
        deepEq_(tracker['ranges'], [[1, 100], [102,102]]);

        tracker.add(103);
        deepEq_(tracker['ranges'], [[1, 100], [102,103]]);

        tracker.add(101);
        deepEq_(tracker['ranges'], [[1, 101], [102,103]]);

        tracker.add(102);
        deepEq_(tracker['ranges'], [[1, 102], [102,103]]);

        tracker.compact();
        deepEq_(tracker['ranges'], [[1, 103]]);

        eq_(tracker.includes(50), true);
        eq_(tracker.includes(120), false);

        tracker.remove(89);
        deepEq_(tracker['ranges'], [[1, 88], [90,103]]);


        tracker = new PackedRanges({
            from: 5, to: 10,
        });
        eq_(tracker.includes(5), false);
        eq_(tracker.next(), 5);
        eq_(tracker.includes(5), true);
        eq_(tracker.next(), 6);
        eq_(tracker.next(), 7);

        '> adding manual';
        tracker.add(8);

        eq_(tracker.next(), 9);
        eq_(tracker.next(), null);

        deepEq_(tracker['ranges'], [ [5, 9] ]);
    },
    'should check inclusion' () {
        let tracker = new PackedRanges({ ranges: [[4,5]] });
        eq_(tracker.includes(5), true);
        eq_(tracker.includes(6), false);

        tracker = new PackedRanges({ ranges: [[2, 4], [5, 6]] });
        eq_(tracker.includes(4), true);
        eq_(tracker.includes(5), true);

        tracker.compact();
        deepEq_(tracker['ranges'], [[2, 6]]);
    },
    'should add range' () {
        ([
            {
                range: [[5,6]],
                add: [4,5],
                final: [[4, 6]]
            },
            {
                range: [[5,6]],
                add: [6,10],
                final: [[5, 10]]
            },
            {
                range: [[5,6]],
                add: [2,4],
                final: [[2, 6]]
            },
            {
                range: [[5,6], [8,9]],
                add: [6,7],
                final: [[5, 9]]
            },
            {
                range: [[5,6], [10,11]],
                add: [7,8],
                final: [[5, 8], [10, 11]]
            },
        ]).forEach(data => {
            let tracker = new PackedRanges({
                ranges: data.range.slice(0) as any
            });

            tracker.addRange(data.add as [number, number]);
            deepEq_(
                tracker['ranges'],
                data.final,
                `Range: ${JSON.stringify(data.range)}, Add: ${JSON.stringify(data.add)}, Final: ${JSON.stringify(data.final)}`
            );
        })
    },
    'should pick from' () {
        ([
            {
                range: [[5,6]],
                from: 4,
                final: [[5, 6]]
            },
            {
                range: [[5,6]],
                from: 6,
                final: [[6, 6]]
            },
            {
                range: [[5,6]],
                from: 5,
                final: [[5, 6]]
            },
            {
                range: [[5,10]],
                from: 8,
                final: [[8, 10]]
            },
            {
                range: [[5,10]],
                from: 12,
                final: []
            },
            {
                range: [[5,10], [14, 20]],
                from: 6,
                final: [[6,10], [14, 20]]
            },
            {
                range: [[5,10], [14, 20]],
                from: 12,
                final: [[14, 20]]
            },
            {
                range: [[5,10], [14, 20]],
                from: 17,
                final: [[17, 20]]
            },
        ]).forEach(data => {
            let tracker = new PackedRanges({
                ranges: data.range.slice(0) as any
            });

            tracker = tracker.pickFrom(data.from);
            deepEq_(
                tracker['ranges'],
                data.final,
                `Range: ${JSON.stringify(data.range)}, From: ${JSON.stringify(data.from)}, Final: ${JSON.stringify(data.final)}`
            );
        })
    },
    'should pick to' () {
        ([
            {
                range: [[5,6]],
                to: 8,
                final: [[5, 6]]
            },
            {
                range: [[5,9]],
                to: 8,
                final: [[5, 8]]
            },
            {
                range: [[5,9]],
                to: 5,
                final: [[5, 5]]
            },
            {
                range: [[5,9]],
                to: 4,
                final: []
            },
            {
                range: [[5,9], [12, 20]],
                to: 10,
                final: [[5,9]]
            },
            {
                range: [[5,9], [12, 20]],
                to: 19,
                final: [[5,9], [12, 19]]
            },
        ]).forEach(data => {
            let tracker = new PackedRanges({
                ranges: data.range.slice(0) as any
            });

            tracker = tracker.pickTo(data.to);
            deepEq_(
                tracker['ranges'],
                data.final,
                `Range: ${JSON.stringify(data.range)}, To: ${JSON.stringify(data.to)}, Final: ${JSON.stringify(data.final)}`
            );
        })
    },
    'should subtract ranges' () {
        ([
            {
                range: [[4,5]],
                remove: [[5,6]],
                final: [[4, 4]]
            },
            {
                range: [[5,6]],
                remove: [[4,8]],
                final: []
            },
            {
                range: [[5,6], [8,9]],
                remove: [[6,9]],
                final: [[5, 5]]
            },
            {
                range: [[5,6], [10,11]],
                remove: [[7,10]],
                final: [[5, 6], [11, 11]]
            },
            {
                range: [[5,6], [10,11], [14, 20]],
                remove: [[6,17]],
                final: [[5, 5], [18, 20]]
            },
            {
                range: [[5,6], [10,11], [14, 20]],
                remove: [[3,5], [7,10], [19, 30]],
                final: [[6,6], [11,11], [14,18]]
            },
            {
                range: [[5,6], [10,11], [14, 20]],
                remove: [[1, 100]],
                final: []
            },
            {
                range: [[1, 100]],
                remove: [[8,18], [23,27], [50,91]],
                final: [[1,7], [19,22],[28,49],[92,100]]
            },
            {
                range: [[1,10], [20,30]],
                remove: [[5,15], [25,35]],
                final: [[1,4], [20,24]]
            },
        ]).forEach(data => {
            let result = PackedRanges.subtract(data.range as any, data.remove as any);
            deepEq_(
                result,
                data.final,
                `Range: ${JSON.stringify(data.range)}, Remove: ${JSON.stringify(data.remove)}, Final: ${JSON.stringify(data.final)}`
            );
        })
    },
    'should create intersactions' () {
        ([
            {
                ranges: [
                    [[4, 10]],
                    [[7, 11]],
                ],
                final: [[7, 10]]
            },
            {
                ranges: [
                    [[4, 10], [12, 17], [21, 29]],
                    [[2, 3], [7, 13], [15, 24], [31, 38]],
                ],
                final: [[7, 10], [12, 13], [15, 17], [21, 24]]
            },
            {
                ranges: [
                    [[4, 10], [12, 17], [21, 29]],
                    [[1, 100]],
                ],
                final: [[4, 10], [12, 17], [21, 29]],
            },

        ]).forEach(data => {
            let result = PackedRanges.intersection(data.ranges as any);
            deepEq_(
                result,
                data.final,
                `Ranges: ${JSON.stringify(data.ranges)}, Final: ${JSON.stringify(data.final)}`
            );
        })
    }
})
