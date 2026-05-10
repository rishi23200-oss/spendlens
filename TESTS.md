# Tests

## Running Tests
```bash
npm test
```

## Test Files

### `__tests__/audit-engine.test.ts`
Tests the core audit engine logic. All 6 tests cover the audit engine specifically.

| Test | What it covers |
|------|---------------|
| recommends downgrade for Cursor Business with ≤3 seats | Cursor Business → Pro downgrade rule fires correctly for small teams |
| flags Cursor as wrong tool for non-coding use case | Use-case mismatch detection works across tools |
| flags Claude Team with <5 seats as overpriced | Claude Team minimum seat rule enforced |
| recommends Anthropic API switch for high OpenAI API spend | Cross-tool alternative recommendation + credexOpportunity flag |
| totalAnnualSavings equals totalMonthlySavings * 12 | Math integrity — annual is always monthly × 12 |
| marks audit as optimal when no savings found | isOptimal flag set correctly, zero savings returned |

## CI
Tests run automatically on every push to `main` via `.github/workflows/ci.yml`.