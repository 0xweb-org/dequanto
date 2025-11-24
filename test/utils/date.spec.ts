import { $date } from '@dequanto/utils/$date'

UTest({
    'should check add seconds' () {
        let date = new Date();
        let x = $date.tool(date).add(`5s`).toUnixTimestamp();
        eq_(x, (date.valueOf() / 1000 | 0) + 5);
    },
    'should calculate week nr' () {
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
