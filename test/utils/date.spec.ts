import { UTest } from 'atma-utest';
import { $date } from 'dequanto/utils/$date'

UTest.create({
    'should parse legacy formats in local time, including seconds' () {
        for (let day of ['20.01.2024', '20-01-2024', '2024.01.20', '2024-01-20']) {
            for (let [time, hours, minutes, seconds] of [
                ['', 0, 0, 0],
                [' 14:05', 14, 5, 0],
                [' 14:00:37', 14, 0, 37],
                [' 23:59:59', 23, 59, 59],
            ] as const) {
                let input = day + time;
                let actual = $date.parse(input);
                let expected = new Date(2024, 0, 20, hours, minutes, seconds);
                eq_(actual.getTime(), expected.getTime(), input);
                eq_(actual.getMilliseconds(), 0, input);
            }
        }
        eq_($date.parse('29.02.2024 14:00:37').getTime(), new Date(2024, 1, 29, 14, 0, 37).getTime());
        eq_($date.parse('29.02.2000').getTime(), new Date(2000, 1, 29).getTime());
        eq_($date.parse('20.01.0099').getTime(), new Date(99, 0, 20).getTime());
    },
    'should preserve legacy calendar and time rollover' () {
        let fallback = new Date(2024, 0, 1);
        for (let [input, expected] of [
            ['31.02.2024', new Date(2024, 2, 2)],
            ['2024-02-31', new Date(2024, 2, 2)],
            ['29.02.2023', new Date(2023, 2, 1)],
            ['20.13.2024', new Date(2025, 0, 20)],
            ['20.01.2024 24:00', new Date(2024, 0, 21)],
            ['2024-01-20 14:60', new Date(2024, 0, 20, 15)],
            ['20.01.2024 14:00:60', new Date(2024, 0, 20, 14, 1)],
            ['20.01.2024 14:00:61', new Date(2024, 0, 20, 14, 1, 1)],
            ['2024-01-20 14:00:61', new Date(2024, 0, 20, 14, 1, 1)],
            ['2024-01-20 23:59:61', new Date(2024, 0, 21, 0, 0, 1)],
        ] as const) {
            eq_($date.parse(input).getTime(), expected.getTime(), input);
            eq_($date.parse(input, fallback).getTime(), expected.getTime(), input);
        }
    },
    'should preserve ISO timezone handling' () {
        for (let input of [
            '2024-01-20T14:00:37.123Z',
            '2024-01-20T14:00:37+02:30',
            '2024-01-20T14:00:37-05:00',
            '2024-01-20T14:00:37',
        ]) {
            eq_($date.parse(input).getTime(), new Date(input).getTime(), input);
        }
    },
    'should preserve Date, timestamp and default inputs' () {
        let fallback = new Date(2024, 0, 1);
        eq_($date.parse(fallback), fallback);
        eq_($date.parse(0).getTime(), 0);
        eq_($date.parse(1_705_766_437_000).getTime(), 1_705_766_437_000);
        for (let input of [null, undefined, '']) {
            eq_($date.parse(input), undefined);
            eq_($date.parse(input, fallback), fallback);
        }
        eq_($date.parse('invalid', fallback), fallback);
        eq_($date.parse('invalid', undefined), undefined);
        let error: Error;
        try {
            $date.parse('invalid');
        } catch (err) {
            error = err;
        }
        eq_(error?.message, 'Invalid format invalid');
    },
    'should check adding seconds' () {
        let date = new Date();
        let x = $date.tool(date).add(`5s`).toUnixTimestamp();
        eq_(x, (date.valueOf() / 1000 | 0) + 5);
    },
    'should calculate the week number' () {
        const isoWeekTests = [
            // ---- 2021 boundary around week rollover ----
            { date: "2020-12-28", week: 53 },
            { date: "2020-12-31", week: 53 },
            { date: "2021-01-01", week: 53 },
            { date: "2021-01-03", week: 53 },
            { date: "2021-01-04", week: 1 },
            { date: "2021-01-10", week: 1 },
            { date: "2021-01-11", week: 2 },
            { date: "2021-01-15", week: 2 },
            { date: "2021-01-31", week: 4 },
            { date: "2021-06-15", week: 24 },
            { date: "2021-09-30", week: 39 },
            { date: "2021-12-31", week: 52 },

            // ---- 2022 ----
            { date: "2022-01-01", week: 52 },
            { date: "2022-01-02", week: 52 },
            { date: "2022-01-03", week: 1 },
            { date: "2022-01-15", week: 2 },
            { date: "2022-01-31", week: 5 },
            { date: "2022-03-31", week: 13 },
            { date: "2022-06-15", week: 24 },
            { date: "2022-09-30", week: 39 },
            { date: "2022-12-31", week: 52 },

            // ---- 2023 ----
            { date: "2023-01-01", week: 52 },
            { date: "2023-01-02", week: 1 },
            { date: "2023-01-15", week: 2 },
            { date: "2023-01-31", week: 5 },
            { date: "2023-03-31", week: 13 },
            { date: "2023-06-15", week: 24 },
            { date: "2023-09-30", week: 39 },
            { date: "2023-12-31", week: 52 },

            // ---- 2024 (leap year – ISO shift) ----
            { date: "2024-01-01", week: 1 },
            { date: "2024-01-07", week: 1 },
            { date: "2024-01-08", week: 2 },
            { date: "2024-01-15", week: 3 },
            { date: "2024-01-31", week: 5 },
            { date: "2024-03-31", week: 13 },
            { date: "2024-06-15", week: 24 },
            { date: "2024-09-30", week: 40 },
            { date: "2024-12-30", week: 1 },
            { date: "2024-12-31", week: 1 },

            // ---- 2025 ----
            { date: "2025-01-01", week: 1 },
            { date: "2025-01-05", week: 1 },
            { date: "2025-01-06", week: 2 },
            { date: "2025-01-15", week: 3 },
            { date: "2025-01-31", week: 5 },
            { date: "2025-03-31", week: 14 },
            { date: "2025-06-15", week: 24 },
            { date: "2025-09-30", week: 40 },
        ];

        isoWeekTests.forEach(({ date, week }) => {
            let nr = $date.weekNumber($date.parse(date));
            eq_(nr, week, `week number for ${date}`);
        });
    }
})
