document.addEventListener('DOMContentLoaded', function() {
 
    const findPathButton = document.querySelector('button[type="submit"]');
    let usageCount = 0;

    document.getElementById('wayfinderForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        findPathButton.disabled = true;
        if(usageCount >= 2){
            findPathButton.textContent = 'Usage Limit Reached';
        }
        usageCount++;
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
        
        document.getElementById('results').innerHTML = '';
        document.getElementById('welcome-card').style.display = 'none';
        const statusCardDiv = document.getElementById('status-card');
        statusCardDiv.innerHTML = '<p>Analyzing your profile...</p>';
        statusCardDiv.style.display = 'block';

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
            document.getElementById('status-card').innerHTML = '<p>An error occurred while fetching results. Please try again later.</p>';
        }
    }

    function displayResults(results) {
        if (usageCount < 3) {
            findPathButton.disabled = false;
        }
        
        document.getElementById('status-card').style.display = 'none';

        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';

        results.suggestedJobs.forEach(job => {
            const jobCard = document.createElement('div');
            jobCard.className = 'job-card';
            jobCard.innerHTML = `
                <h3>${job.jobTitle}</h3>
                <p>Annual Salary: ${job.salaryRange} €</p>
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