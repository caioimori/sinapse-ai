// Wizard test - uses describeIntegration due to file dependencies
/**
 * Questions Test Suite
 *
 * Tests the surviving wizard question builders. The deprecated/dead builders
 * (project type, user profile, MCP, environment, squad, tech preset, question
 * sequence/by-id) were pruned in the dead-code sweep; their tests were removed
 * with them.
 */

const {
  getLanguageQuestion,
  getLLMQuestion,
  getIDEQuestions,
} = require('../../packages/installer/src/wizard/questions');

describeIntegration('questions', () => {
  describeIntegration('getLanguageQuestion', () => {
    test('returns valid inquirer list question', () => {
      const question = getLanguageQuestion();

      expect(question).toHaveProperty('type', 'list');
      expect(question).toHaveProperty('name', 'language');
      expect(question).toHaveProperty('choices');
      expect(Array.isArray(question.choices)).toBe(true);
    });

    test('defaults to Portuguese', () => {
      const question = getLanguageQuestion();
      expect(question.default).toBe('pt');
    });

    test('offers both pt and en choices', () => {
      const question = getLanguageQuestion();
      const values = question.choices.map((c) => c.value);
      expect(values).toContain('pt');
      expect(values).toContain('en');
    });
  });

  describeIntegration('getLLMQuestion', () => {
    test('returns valid inquirer list question', () => {
      const question = getLLMQuestion();

      expect(question).toHaveProperty('type', 'list');
      expect(question).toHaveProperty('name', 'selectedLLM');
      expect(question).toHaveProperty('choices');
    });

    test('offers claude-code, codex and both', () => {
      const question = getLLMQuestion();
      const values = question.choices.map((c) => c.value);
      expect(values).toContain('claude-code');
      expect(values).toContain('codex');
      expect(values).toContain('both');
    });
  });

  describeIntegration('getIDEQuestions', () => {
    test('returns array of IDE selection questions (Story 1.4)', () => {
      const questions = getIDEQuestions();
      expect(Array.isArray(questions)).toBe(true);
    });

    test('returns one IDE selection question', () => {
      const questions = getIDEQuestions();
      expect(questions).toHaveLength(1);
      expect(questions[0]).toHaveProperty('name', 'selectedIDEs');
      expect(questions[0]).toHaveProperty('type', 'checkbox');
    });
  });
});
