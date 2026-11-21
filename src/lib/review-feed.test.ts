import assert from 'node:assert/strict';
import test from 'node:test';
import { reviewFeedSchema } from './review-feed.ts';

test('accepts real counts without any text reviews', () => {
  assert.equal(reviewFeedSchema.parse({rating: 4.7, total: 321, reviews: []}).total, 321);
});
test('rejects fabricated or malformed provider fields', () => {
  for (const fields of [{rating: 6, total: 2}, {rating: 5, total: -1}, {rating: 5, total: 2.5}]) {
    assert.equal(reviewFeedSchema.safeParse({...fields, reviews: []}).success, false);
  }
  assert.equal(reviewFeedSchema.safeParse({rating: 5, total: 1, reviews: [{name:'Guest', rating:5, date:'yesterday', title:'Great', snippet:'Nice'}]}).success, false);
});
