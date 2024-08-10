document.addEventListener('DOMContentLoaded', function() {
    // Get form element
    const wayfinderForm = document.getElementById('wayfinderForm');

    // Add submit event listener to the form
    wayfinderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        findPath();
    });

    async function findPath() {
        const formData = {
            currentJob: document.getElementById('currentJob').value,
            salary: parseInt(document.getElementById('salary').value),
            education: document.getElementById('education').value,
            skills: [
                document.getElementById('skill1').value,
                document.getElementById('skill2').value,
                document.getElementById('skill3').value
            ].filter(Boolean),
            notes: document.getElementById('notes').value
        };
        
        document.getElementById('welcomeCard').style.display = 'none';

        const requestInformationDiv = document.getElementById('requestInformation')
        requestInformationDiv.innerHTML = '<p>Analyzing your profile...</p>';
        requestInformationDiv.style.display = 'block';

        try {
            const response = await fetch('https://5kvvps6264.execute-api.eu-west-2.amazonaws.com/default/wayfinder-gateway', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            displayResults({ suggestedJobs: data });
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('requestInformation').innerHTML = '<p>An error occurred while fetching results. Please try again later.</p>';
        }
    }

    function displayResults(results) {
        document.getElementById('requestInformation').style.display = 'none';

        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';

        results.suggestedJobs.forEach(job => {
            const jobCard = document.createElement('div');
            jobCard.className = 'job-card';
            jobCard.innerHTML = `
                <h3>${job.jobTitle}</h3>
                <p>Salary: ${job.salaryRange}</p>
                <p>Match: ${job.matchPercentage}%</p>
                <div class="progress-bar">
                    <div class="progress" style="width: ${job.matchPercentage}%"></div>
                </div>
                <h4>Required Skills:</h4>
                <ul>
                    ${job.requiredSkills.map(skill => `<li>${skill}</li>`).join('')}
                </ul>
                <h4>Recommended Training:</h4>
                <ul>
                    ${job.recommendedTraining.map(training => `<li>${training}</li>`).join('')}
                </ul>
            `;
            resultsDiv.appendChild(jobCard);
        });
    }
});