\# Sanctuary Home



\*Your home, evolved. Proactive, safe, and aware.\*



This project is a Minimum Viable Product (MVP) submitted for the Google Home APIs Developer Challenge. It demonstrates a proactive smart home system that integrates with wearable user data to create a truly safe and comfortable environment.



\## The Core Idea



The evolutionary need for a safe shelter is the foundation of this project. "Sanctuary Home" connects data from the user's wearables (heart rate, SpO2) with smart home devices. The home doesn't just react; it anticipates needs and acts preventively, especially for vulnerable individuals (elderly, people with disabilities, children).

For those who can't say out loud "Okay Google!" in Emergence Cases.


Proactive, Not Reactive: Moves beyond simple commands to anticipate needs and prevent emergencies based on the user's physiological state.

Hardware-Agnostic Software Solution: Leverages existing user wearables and standard Google Home devices, making it a highly scalable, low-cost software-as-a-service (SaaS) solution.

Focus on Vulnerable Populations: Provides a critical safety net for the elderly, individuals living alone, and people with disabilities, offering peace of mind to them and their families.

Autonomous Emergency Protocol: A unique, life-saving feature that unlocks doors, activates visual alerts, and notifies trusted contacts with camera access, overcoming situations where a user is unable to call for help.

Seamless Integration with Google Home: Built from the ground up to utilize the power and ubiquity of Google Home APIs, creating a deeply integrated and reliable experience.



\## Features



\- \*\*Real-time Monitoring\*\*: A live dashboard displays the user's vital signs and home environment data.

\- \*\*Comfort Automation\*\*: The system automatically adjusts the thermostat or ventilation based on user stress levels or poor air quality.

\- \*\*Emergency Protocol\*\*: In case of a fall or a medical emergency (detected by a sharp change in vitals), the system:

&nbsp;   1. Initiates a 7-second confirmation countdown.

&nbsp;   2. If not deactivated, it unlocks the front door for emergency services.

&nbsp;   3. Activates a flashing red outdoor light as a visual beacon.

&nbsp;   4. Sends an alert with a secure link to an internal camera feed to a trusted contact.

\- \*\*Full Simulation\*\*: The entire logic is simulated in this MVP, allowing for a clear demonstration of all features without physical hardware.


TRY DEMO HERE   https://sanctuary-home.onrender.com/



\## Technology Stack



\- \*\*Backend\*\*: Node.js, Express.js

\- \*\*Real-time Communication\*\*: WebSockets

\- \*\*Frontend\*\*: HTML, CSS, JavaScript (no frameworks)

\- \*\*APIs Simulated\*\*: Google Home (Thermostat, Lock, Light, Camera)



---



\## How to Run Locally



Follow these simple steps to run the simulation on your machine.



\### Prerequisites



\- \[Node.js](https://nodejs.org/) (which includes npm)

\- \[Git](https://git-scm.com/)



\### Installation \& Launch



1\.  \*\*Clone the repository:\*\*

&nbsp;   ```bash

&nbsp;   git clone https://github.com/TVOY\_USERNAME/sanctuary-home.git

&nbsp;   ```



2\.  \*\*Navigate to the project directory:\*\*

&nbsp;   ```bash

&nbsp;   cd sanctuary-home

&nbsp;   ```



3\.  \*\*Install dependencies:\*\*

&nbsp;   ```bash

&nbsp;   npm install

&nbsp;   ```



4\.  \*\*Start the server:\*\*

&nbsp;   ```bash

&nbsp;   node server.js

&nbsp;   ```



5\.  \*\*Open your browser\*\* and go to `http://localhost:3000`. You should see the control panel.



\## How to Use the Demo



Once the application is running in your browser:



\- \*\*Normal Scenario\*\*: The system shows normal vitals and environment.

\- \*\*Stress / High CO₂ Scenario\*\*: Click this button to simulate a user feeling stressed or a room with poor air quality. Observe the `System Log` as the home automatically activates ventilation and adjusts the temperature.

\- \*\*Emergency (Fall) Scenario\*\*: Click this button to simulate a medical emergency.

&nbsp;   - Watch the `System Log` for the initial \*\*red\*\* alert and the 7-second countdown.

&nbsp;   - \*\*Do nothing\*\*, and after 7 seconds, observe the log as the full Emergency Protocol is activated (door unlock, light, camera sharing).

