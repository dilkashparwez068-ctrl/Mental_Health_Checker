/**
 * Minimal Behavioral Wellness Assessment Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('assessment-form');

    // Input elements
    const ageInput = document.getElementById('age');
    const genderSelect = document.getElementById('gender');
    const countrySelect = document.getElementById('country');
    const customCountryInput = document.getElementById('custom_country');
    const academicSelect = document.getElementById('academic_level');
    const platformSelect = document.getElementById('most_used_platform');
    const purposeSelect = document.getElementById('purpose_of_use');
    const usageInput = document.getElementById('avg_daily_usage_hours');
    const unlocksInput = document.getElementById('daily_unlocks');
    const sleepInput = document.getElementById('sleep_hours_per_night');
    const studyInput = document.getElementById('study_hours');
    const activityInput = document.getElementById('physical_activity_hours');
    const stressSelect = document.getElementById('stress_level');
    const submitBtn = document.getElementById('submit-btn');

    // Output elements
    const scoreVal = document.getElementById('score-val');
    const scoreStatusText = document.getElementById('score-status-text');
    const statusPillBadge = document.getElementById('status-pill-badge');
    const summaryCaption = document.getElementById('summary-caption');

    // Metric Tiles
    const tileSleep = document.getElementById('tile-sleep');
    const tileStudy = document.getElementById('tile-study');
    const tileUsage = document.getElementById('tile-usage');
    const tileStress = document.getElementById('tile-stress');

    // Live update tiles when inputs change
    function updateMetricTiles() {
        tileSleep.textContent = sleepInput.value ? `${parseFloat(sleepInput.value).toFixed(1)}h` : '--';
        tileStudy.textContent = studyInput.value ? `${parseFloat(studyInput.value).toFixed(1)}h` : '--';
        tileUsage.textContent = usageInput.value ? `${parseFloat(usageInput.value).toFixed(1)}h` : '--';
        tileStress.textContent = stressSelect.value ? stressSelect.value : '--';
    }

    [sleepInput, studyInput, usageInput, stressSelect].forEach(elem => {
        elem.addEventListener('input', updateMetricTiles);
        elem.addEventListener('change', updateMetricTiles);
    });

    // Form Submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Determine effective country
        let countryValue = countrySelect.value || 'Other';
        if (customCountryInput.value && (countryValue === 'Other' || !countryValue)) {
            countryValue = customCountryInput.value.trim();
        }

        const payload = {
            age: parseInt(ageInput.value) || 21,
            gender: genderSelect.value || 'Male',
            country: countryValue,
            academic_level: academicSelect.value || 'Undergraduate',
            most_used_platform: platformSelect.value || 'Instagram',
            purpose_of_use: purposeSelect.value || 'Entertainment',
            avg_daily_usage_hours: parseFloat(usageInput.value) || 0,
            daily_unlocks: parseInt(unlocksInput.value) || 0,
            study_hours: parseFloat(studyInput.value) || 0,
            physical_activity_hours: parseFloat(activityInput.value) || 0,
            sleep_hours_per_night: parseFloat(sleepInput.value) || 0,
            stress_level: stressSelect.value || 'Medium'
        };

        submitBtn.disabled = true;
        submitBtn.querySelector('span').textContent = 'Evaluating...';

        // Connect across ports (e.g. if served on 127.0.0.1:5500 via VS Code Live Server)
        const apiBase = (window.location.port !== '8000' && window.location.protocol.startsWith('http')) 
            ? 'http://127.0.0.1:8000' 
            : '';

        try {
            const res = await fetch(`${apiBase}/predict`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('Model request failed');

            const data = await res.json();
            const score = parseFloat(data.predicted_mental_health_score);

            // Update Score & Badges
            scoreVal.textContent = score.toFixed(1);

            if (score >= 7.5) {
                statusPillBadge.textContent = 'Optimal';
                scoreStatusText.textContent = 'HEALTHY BALANCE';
                summaryCaption.textContent = 'Strong restorative indicators with balanced digital usage.';
            } else if (score >= 6.0) {
                statusPillBadge.textContent = 'Moderate';
                scoreStatusText.textContent = 'BALANCED HABITS';
                summaryCaption.textContent = 'Habits align within standard behavioral variance.';
            } else {
                statusPillBadge.textContent = 'Elevated Strain';
                scoreStatusText.textContent = 'DIGITAL STRAIN';
                summaryCaption.textContent = 'Indicators reflect elevated screen time and rest deficit.';
            }

            updateMetricTiles();

        } catch (err) {
            console.error(err);
            scoreVal.textContent = '--';
            scoreStatusText.textContent = 'ERROR';
            summaryCaption.textContent = 'Could not generate prediction. Ensure the backend is running.';
        } finally {
            submitBtn.disabled = false;
            submitBtn.querySelector('span').textContent = 'Generate Assessment';
        }
    });

    updateMetricTiles();
});
