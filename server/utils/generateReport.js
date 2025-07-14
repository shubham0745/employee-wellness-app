const PDFDocument = require('pdfkit');
const moment = require('moment');

function generateReport(user, gadAnswers, phqAnswers, gadScore, phqScore, customScore = null) {
  const doc = new PDFDocument({ margin: 50 });

  const getSeverity = (type, score) => {
    if (type === 'GAD') {
      if (score <= 4) return 'Minimal anxiety';
      if (score <= 9) return 'Mild anxiety';
      if (score <= 14) return 'Moderate anxiety';
      return 'Severe anxiety';
    } else {
      if (score <= 4) return 'Minimal depression';
      if (score <= 9) return 'Mild depression';
      if (score <= 14) return 'Moderate depression';
      if (score <= 19) return 'Moderately severe depression';
      return 'Severe depression';
    }
  };

  const getCustomRecommendation = (score) => {
    if (score === null) return '';
    if (score <= 15)
      return 'Chilled out and relatively calm. Stress isn’t much of an issue.';
    if (score <= 20)
      return 'Fairly low. Coping should be a breeze, but you probably have a tough day now and then.';
    if (score <= 25)
      return 'Moderate stress. Some job aspects may be stressful but manageable.';
    if (score <= 30)
      return 'Severe. Life at work might sometimes feel miserable. Counseling may help.';
    return 'Potentially dangerous stress. Seek professional help or consider role changes.';
  };

  // Header
  doc.fontSize(20).fillColor('#003366').text('Mental Health Assessment Report', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).fillColor('black').text('Name: ' + user.name);
  doc.text('Date of Birth: ' + moment(user.date_of_birth).format('DD-MM-YYYY'));
  doc.text('Exported on: ' + moment().format('DD-MM-YYYY'));
  doc.moveDown();

  // GAD Section
  doc.fontSize(16).fillColor('#003366').text('GAD-7 Assessment', { underline: true });
  doc.fontSize(12).fillColor('black').text('Score: ' + gadScore + ' (' + getSeverity('GAD', gadScore) + ')');
  doc.moveDown(0.5);
  gadAnswers.forEach((item, i) => {
    doc.text((i + 1) + '. ' + item.question);
    doc.text('    Response: ' + item.responseText);
    doc.moveDown(0.3);
  });

  doc.moveDown(1);

  // PHQ Section
  doc.fontSize(16).fillColor('#003366').text('PHQ-9 Assessment', { underline: true });
  doc.fontSize(12).fillColor('black').text('Score: ' + phqScore + ' (' + getSeverity('PHQ', phqScore) + ')');
  doc.moveDown(0.5);
  phqAnswers.forEach((item, i) => {
    doc.text((i + 1) + '. ' + item.question);
    doc.text('    Response: ' + item.responseText);
    doc.moveDown(0.3);
  });

  // Final Recommendation
  if (customScore !== null) {
    doc.moveDown(1);
    doc.fontSize(16).fillColor('#003366').text('Recommendation Based on Job-Related Well-being', {
      underline: true,
    });
    doc.fontSize(12).fillColor('black').text('Total Score: ' + customScore);
    doc.moveDown(0.5);
    doc.fillColor('#444444').text(getCustomRecommendation(customScore), {
      align: 'left',
      indent: 20,
      lineGap: 4,
    });
  }

  return doc;
}

module.exports = generateReport;
