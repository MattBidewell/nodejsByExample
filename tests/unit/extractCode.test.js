/**
 * Unit Tests for extractCode() function
 * 
 * Tests the core parsing logic that separates comments from code
 * and applies syntax highlighting.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { extractCode } from '../../tools/generate.js';

describe('extractCode() - Unit Tests', () => {
  it('separates comments from code correctly', () => {
    const sections = ['// This is a comment\nconst x = 1;'];
    const result = extractCode(sections, 'javascript');
    
    assert.strictEqual(result.length, 1);
    assert.ok(result[0].comment.includes('This is a comment'), 'should extract comment');
    assert.ok(result[0].code.includes('const'), 'should have code');
  });

  it('handles multiple comment lines', () => {
    const sections = ['// Line 1\n// Line 2\nconst x = 1;'];
    const result = extractCode(sections, 'javascript');
    
    assert.ok(result[0].comment.includes('Line 1'), 'should have first comment line');
    assert.ok(result[0].comment.includes('Line 2'), 'should have second comment line');
  });

  it('handles sections with only code (no comments)', () => {
    const sections = ['const x = 1;\nconst y = 2;'];
    const result = extractCode(sections, 'javascript');
    
    assert.strictEqual(result[0].comment, '', 'comment should be empty');
    assert.ok(result[0].code.includes('const'), 'should have code');
  });

  it('handles sections with only comments (no code)', () => {
    const sections = ['// Just a comment\n// Another comment'];
    const result = extractCode(sections, 'javascript');
    
    assert.ok(result[0].comment.includes('Just a comment'), 'should have comment');
    assert.ok(result[0].comment.includes('Another comment'), 'should have second comment');
  });

  it('handles empty sections', () => {
    const sections = [''];
    const result = extractCode(sections, 'javascript');
    
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].comment, '');
  });

  it('handles multiple sections', () => {
    const sections = [
      '// Section 1\nconst a = 1;',
      '// Section 2\nconst b = 2;'
    ];
    const result = extractCode(sections, 'javascript');
    
    assert.strictEqual(result.length, 2);
    assert.ok(result[0].comment.includes('Section 1'));
    assert.ok(result[1].comment.includes('Section 2'));
  });

  it('applies syntax highlighting', () => {
    const sections = ['const x = 1;'];
    const result = extractCode(sections, 'javascript');
    
    // highlight.js adds span elements with hljs-* classes
    assert.ok(result[0].code.includes('hljs-'), 'should have highlighting classes');
  });

  it('preserves HTML in comments', () => {
    const sections = ['// This has <b>bold</b> text\nconst x = 1;'];
    const result = extractCode(sections, 'javascript');
    
    assert.ok(result[0].comment.includes('<b>bold</b>'), 'should preserve HTML tags');
  });

  it('handles shell language highlighting', () => {
    const sections = ['// Run command\n$ npm install'];
    const result = extractCode(sections, 'shell');
    
    assert.ok(result[0].comment.includes('Run command'));
    // Shell highlighting may or may not add classes depending on the command
    assert.ok(result[0].code.includes('npm'), 'should have shell code');
  });

  it('strips // prefix from comments', () => {
    const sections = ['// Comment here\ncode();'];
    const result = extractCode(sections, 'javascript');
    
    // Should not start with // 
    assert.ok(!result[0].comment.startsWith('//'), 'should strip // prefix');
    assert.ok(result[0].comment.includes('Comment here'));
  });
});
