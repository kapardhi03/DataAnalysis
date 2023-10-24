const getRequest = async(email, retries = 3) => {
    try {
        let response = await fetch(`https://one00x-data-analysis.onrender.com/assignment`, {
            method: "GET"
        })
        if (response.ok) {
            console.log("Request successful");
            const headers = response.headers
            const data = await response.json()
            console.log(headers);
            return [headers.get('id'), data]
        } else {
            console.log("request failed", response.status);
            if (response.status === 500) {
                console.log("Internal Server Error");
                if (retries > 0 && (!response || !response.ok)) {
                    console.log(`retry , ${retries} left`);
                    return await getRequest(email, retries - 1);
                }
                if (response) {
                    console.log("Request succesful");
                    return [null, null];
                }
            }
        }
    } catch (e) {
        console.log(`Encounterd with error ${e}`);
    }
}

const findMaxFreq = (data) => {
    const freq = {};
    data.forEach(entry => {
        if (freq[entry]) freq[entry] += 1;
        else freq[entry] = 1;
    })
    const maxi = Object.keys(freq).reduce((acc, curr) => (freq[acc] > freq[curr] ? acc : curr), null);
    console.log(`Most used word is: ${maxi}`);
    return maxi;
}

const postResponse = async(email, [assignmentId, highestFreqWord]) => {
    const headers = {
        'Content-type': 'application/json',
    };
    try {
        const response = await fetch(`https://one00x-data-analysis.onrender.com/assignment?email=${email}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                assignment_id: assignmentId,
                answer: highestFreqWord,
            }),
        })
        console.log(`Submitted`);
        const data = await response.json();
        console.log(data);
    } catch (e) {
        console.log(`caught Exception: ${e}`);
    }
}

const main = async(email) => {
    const [assignmentID, data] = await getRequest(email);
    const maxWord = findMaxFreq(data);
    await postResponse(email, [assignmentID, maxWord]);
}

main(`kapardhikannekanti@gmail.com`);