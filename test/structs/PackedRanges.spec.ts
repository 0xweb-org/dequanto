import { PackedRanges } from '@dequanto/structs/PackedRanges';

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
    }
})
