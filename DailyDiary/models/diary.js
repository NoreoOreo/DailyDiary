export default class DiaryEntry {
  /**
   * @param {string|number} id - unique ID (obligatory)
   * @param {string} title - Page title (obligatory)
   * @param {string} event - What happened (obligatory)
   * @param {string} positiveReflections - Positive reflections (obligatory)
   * @param {string} negativeReflections - Negative reflections (obligatory)
   * @param {string} lessonsLearned - Lessons learned (obligatory)
   * @param {string|Date} date - Creation date (obligatory)
   * @param {string} picture - Picture URI (optional)
   * @param {string} [caption] - Optional caption for the picture
   */
  constructor(id, title, event, positiveReflections, negativeReflections, lessonsLearned, date, picture, caption = null) {
    if (!id || !title || !event || !positiveReflections || !negativeReflections || !lessonsLearned || !date) {
      throw new Error('All fields except caption/picture are required.');
    }
    this.id = id;       // unique ID
    this.title = title; // Page title
    this.picture = picture; // Picture URI optional
    this.caption = caption; // Optional caption
    this.whatHappened = event; // What happened
    this.whatWasGood = positiveReflections; // Positive reflections
    this.whatWasBad = negativeReflections;  // Negative reflections
    this.whatDidILearn = lessonsLearned; // Lessons learned
    this.date = date;   // Creation date
  }
}

