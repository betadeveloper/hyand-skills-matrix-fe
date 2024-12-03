import React from "react";
import { Box, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const CareerLevelRequirements = () => {
  const handleGoBack = () => {
    window.history.back();
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFBFD" }}>
      <Box display="flex" justifyContent="center" mb={4} mr={95} mt={3}>
        <Button startIcon={<ArrowBack />} variant="outlined" onClick={handleGoBack}>
          Go Back
        </Button>
      </Box>

      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h3 style={{ marginBottom: "10px" }}>Communication</h3>
        <p style={{ marginBottom: "20px" }}>Effective verbal and written communication</p>
        <table border="1" cellPadding="8" style={{ width: "50%", margin: "0 auto", marginBottom: "30px", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#66B3FF" }}> {/* Lighter Blue */}
          <tr>
            <th>Level</th>
            <th>Expectation</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>Junior</td>
            <td style={{ textAlign: "left" }}>Able to convey basic ideas and instructions.</td>
          </tr>
          <tr>
            <td>Regular</td>
            <td style={{ textAlign: "left" }}>Demonstrates structured communication in both oral and written forms.</td>
          </tr>
          <tr>
            <td>Senior</td>
            <td style={{ textAlign: "left" }}>Articulates complex concepts effectively.</td>
          </tr>
          <tr>
            <td>Lead</td>
            <td style={{ textAlign: "left" }}>Masters tailoring communication based on the audience.</td>
          </tr>
          <tr>
            <td>Principal</td>
            <td style={{ textAlign: "left" }}>Sets communication standards.</td>
          </tr>
          </tbody>
        </table>
      </div>

      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h3 style={{ marginBottom: "10px" }}>Technical Expertise</h3>
        <p style={{ marginBottom: "20px" }}>Proficiency in relevant programming languages and frameworks</p>
        <table border="1" cellPadding="8" style={{ width: "50%", margin: "0 auto", marginBottom: "30px", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#66B3FF" }}> {/* Lighter Blue */}
          <tr>
            <th>Level</th>
            <th>Expectation</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>Junior</td>
            <td style={{ textAlign: "left" }}>Basic understanding of core programming concepts and technologies.</td>
          </tr>
          <tr>
            <td>Regular</td>
            <td style={{ textAlign: "left" }}>Proficient in common technologies, able to write efficient code.</td>
          </tr>
          <tr>
            <td>Senior</td>
            <td style={{ textAlign: "left" }}>Deep understanding of frameworks, best practices, and performance optimization.</td>
          </tr>
          <tr>
            <td>Lead</td>
            <td style={{ textAlign: "left" }}>Guides the team on complex technical decisions and architectures.</td>
          </tr>
          <tr>
            <td>Principal</td>
            <td style={{ textAlign: "left" }}>Shapes the direction of technology and implements long-term technical strategies.</td>
          </tr>
          </tbody>
        </table>
      </div>

      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h3 style={{ marginBottom: "10px" }}>Leadership</h3>
        <p style={{ marginBottom: "20px" }}>Mentoring and guiding teams to success</p>
        <table border="1" cellPadding="8" style={{ width: "50%", margin: "0 auto", marginBottom: "30px", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#66B3FF" }}> {/* Lighter Blue */}
          <tr>
            <th>Level</th>
            <th>Expectation</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>Junior</td>
            <td style={{ textAlign: "left" }}>Receives guidance and mentorship from senior colleagues.</td>
          </tr>
          <tr>
            <td>Regular</td>
            <td style={{ textAlign: "left" }}>Collaborates with peers and supports junior developers.</td>
          </tr>
          <tr>
            <td>Senior</td>
            <td style={{ textAlign: "left" }}>Mentors team members, drives initiatives, and promotes collaboration.</td>
          </tr>
          <tr>
            <td>Lead</td>
            <td style={{ textAlign: "left" }}>Leads teams, resolves conflicts, and drives project success.</td>
          </tr>
          <tr>
            <td>Principal</td>
            <td style={{ textAlign: "left" }}>Leads and influences organizational strategy and culture.</td>
          </tr>
          </tbody>
        </table>
      </div>

      <div style={{ textAlign: "center", marginBottom: "30px", paddingBottom: "30px" }}>
        <h3 style={{ marginBottom: "10px" }}>Problem Solving</h3>
        <p style={{ marginBottom: "20px" }}>Approaching and solving complex challenges</p>
        <table border="1" cellPadding="8" style={{ width: "50%", margin: "0 auto", marginBottom: "30px", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#66B3FF" }}> {/* Lighter Blue */}
          <tr>
            <th>Level</th>
            <th>Expectation</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>Junior</td>
            <td style={{ textAlign: "left" }}>Can solve basic problems with guidance.</td>
          </tr>
          <tr>
            <td>Regular</td>
            <td style={{ textAlign: "left" }}>Solves intermediate problems independently with some assistance for complex ones.</td>
          </tr>
          <tr>
            <td>Senior</td>
            <td style={{ textAlign: "left" }}>Effectively tackles complex problems with innovative solutions.</td>
          </tr>
          <tr>
            <td>Lead</td>
            <td style={{ textAlign: "left" }}>Facilitates problem-solving across teams and provides strategic solutions.</td>
          </tr>
          <tr>
            <td>Principal</td>
            <td style={{ textAlign: "left" }}>Drives organization-wide problem-solving strategies and fosters innovation.</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CareerLevelRequirements;
