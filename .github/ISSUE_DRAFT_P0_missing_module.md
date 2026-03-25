# [P0] Missing SINAPSE Core module: utils/repository-detector - Blocks Linux Installation

## 🔴 Priority: P0 (CRITICAL - Installation Blocked)

**Severity:** CRITICAL - Blocks all installation testing on Linux
**Platform:** Linux (Ubuntu 24.04 WSL)
**Story:** [Story 1.10c - Linux Testing](../docs/stories/v2.1/sprint-1/story-1.10c-linux-testing.md)
**Discovered By:** @quality-gate (Quinn) - QA Test Architect
**Date Discovered:** 2025-01-23
**Assigned To:** @developer (Dex) - Development Lead

---

## 📋 Description

The SINAPSE installer fails immediately on Linux systems with a module not found error, preventing any installation or testing. The installer cannot locate the SINAPSE Core module `utils/repository-detector`, blocking all Linux platform validation for Story 1.10c.

**Impact:** This is a **CRITICAL BLOCKER** for Sprint 1 completion, as Story 1.10c cannot proceed without a working installer on Linux.

---

## 🐛 Error Details

### Error Message

```
Error: Cannot find SINAPSE Core module: utils/repository-detector
Searched: ${PROJECT_ROOT}/.sinapse-ai/utils/repository-detector
Please ensure sinapse-ai is installed correctly.
    at loadSINAPSECore (${PROJECT_ROOT}/bin/sinapse-init.js:43:11)
```

### Stack Trace Location

- **File:** `bin/sinapse-init.js`
- **Line:** 43
- **Function:** `loadSINAPSECore`

---

## 🔬 Reproduction Steps

### Prerequisites

- Ubuntu 24.04 LTS (WSL) or native Linux
- Node.js v18.20.8+
- SINAPSE-Fullstack repository cloned

### Steps to Reproduce

1. Open WSL Ubuntu terminal or native Linux shell
2. Create test directory:

   ```bash
   mkdir -p /tmp/sinapse-test-install
   cd /tmp/sinapse-test-install
   ```

3. Execute installer:

   ```bash
   node ${PROJECT_ROOT}/bin/sinapse-init.js --help
   ```

4. **Observe:** Installation fails with module not found error

### Expected Behavior

- Installer should locate SINAPSE Core module successfully
- Help text should display (with `--help` flag)
- Installation wizard should launch (without flags)
- Installation should proceed normally

### Actual Behavior

- Installation crashes immediately on module import
- Error points to missing `utils/repository-detector` module
- No installation wizard launched
- No help text displayed

---

## 🎯 Impact Assessment

### User Impact

- **Installation:** ❌ Completely blocked on Linux platforms
- **Testing:** ❌ Cannot validate installer functionality
- **Story 1.10c:** ⛔ Blocked - 0% test completion
- **Sprint 1:** ⚠️ At risk if not resolved immediately

### Affected Platforms

- ✅ **Windows:** Unknown (not tested in this context)
- ✅ **macOS:** Unknown (not tested in this context)
- ❌ **Linux (Ubuntu):** FAILS - Module not found
- ❌ **Linux (Debian):** Likely fails (untested due to P0)
- ❌ **Linux (Fedora):** Likely fails (untested due to P0)

### Test Coverage Impact

- **Planned Test Scenarios:** 14
- **Executed:** 1 (7%)
- **Blocked:** 13 (93%)
- **Estimated Time Lost:** 6-7 hours of testing time

---

## 🔍 Root Cause Analysis

### Suspected Issues

1. **Module Path Resolution (Most Likely)**
   - Path may be constructed incorrectly for Linux filesystem structure
   - WSL mounted drives (`/mnt/c/...`) may not be handled correctly
   - Cross-platform path separator issues (Windows `\` vs Linux `/`)

2. **Missing File/Directory**
   - `.sinapse-ai/utils/repository-detector.js` may not exist in repository
   - Module may have been renamed or moved in recent commits
   - Build/install process may not create required directory structure

3. **Incorrect Module Import**
   - `require()` statement may use hard-coded Windows path
   - Relative path resolution may fail in WSL environment
   - Missing path normalization before module require

### Investigation Needed

- [ ] Verify `.sinapse-ai/utils/repository-detector.js` exists in repo
- [ ] Check `bin/sinapse-init.js:43` for path construction logic
- [ ] Review recent commits for module renames/moves
- [ ] Test module loading on Windows vs Linux
- [ ] Verify build process creates required directory structure

---

## 💡 Recommended Fix

### Short-Term (Immediate Fix)

1. **Verify module exists:**

   ```bash
   ls -la .sinapse-ai/utils/repository-detector.js
   ```

2. **Fix path resolution in `bin/sinapse-init.js:43`:**

   ```javascript
   // Before (suspected):
   const detector = require('./.sinapse-ai/utils/repository-detector');

   // After (cross-platform):
   const path = require('path');
   const detectorPath = path.resolve(__dirname, '..', '.sinapse-ai', 'utils', 'repository-detector');
   const detector = require(detectorPath);
   ```

3. **Add file existence check:**

   ```javascript
   const fs = require('fs');
   if (!fs.existsSync(detectorPath + '.js')) {
     console.error('SINAPSE Core module not found.');
     console.error('Please run: npm install');
     process.exit(1);
   }
   ```

4. **Test in WSL Ubuntu:**
   ```bash
   wsl bash -c "cd /tmp/sinapse-test-install && node /mnt/c/.../bin/sinapse-init.js --help"
   ```

### Long-Term (Prevention)

1. **Add pre-flight checks to installer:**
   - Validate all required modules exist before proceeding
   - Provide clear error messages with resolution steps
   - Add `--debug` flag to show module resolution paths

2. **Create automated smoke tests:**
   - Test installer on Windows, macOS, Linux in CI/CD
   - Verify module loading before full installation test
   - Catch cross-platform issues early

3. **Improve error messaging:**
   - Show actual search paths attempted
   - Suggest common fixes (reinstall, verify installation)
   - Provide troubleshooting URL for module issues

---

## 🧪 Test Environment

### Working Configuration

- **OS:** Ubuntu 24.04.2 LTS (WSL2)
- **Kernel:** 5.15.167.4-microsoft-standard-WSL2
- **Node.js:** v18.20.8
- **Git:** 2.43.0
- **npm:** 10.8.2

### Prerequisites Verified

| Requirement   | Status            |
| ------------- | ----------------- |
| Ubuntu 22.04+ | ✅ PASS (24.04.2) |
| Node.js 18+   | ✅ PASS (18.20.8) |
| Git           | ✅ PASS (2.43.0)  |
| npm           | ✅ PASS (10.8.2)  |
| Internet      | ✅ Connected      |

**All prerequisites met** - issue is in installer code, not environment.

---

## 📎 Related Resources

### Documentation

- **Test Report:** [docs/testing/1.10c-linux-test-report.md](../docs/testing/1.10c-linux-test-report.md)
- **Story 1.10c:** [docs/stories/v2.1/sprint-1/story-1.10c-linux-testing.md](../docs/stories/v2.1/sprint-1/story-1.10c-linux-testing.md)
- **Parent Story:** [docs/stories/v2.1/sprint-1/story-1.10-cross-platform-CONSOLIDATED.md](../docs/stories/v2.1/sprint-1/story-1.10-cross-platform-CONSOLIDATED.md)

### Code References

- **Installer:** `bin/sinapse-init.js:43` (error location)
- **Missing Module:** `.sinapse-ai/utils/repository-detector` (expected location)

### Related Stories

- Story 1.10a - Windows Testing (parallel story)
- Story 1.10b - macOS Testing (parallel story)
- Stories 1.1-1.9 - Installer dependencies

---

## ✅ Acceptance Criteria for Fix

Fix is DONE when:

1. **Module Loads Successfully**
   - [ ] Installer runs without module not found error
   - [ ] Help text displays with `--help` flag
   - [ ] Installation wizard launches without flags

2. **Cross-Platform Compatibility**
   - [ ] Works on native Linux (Ubuntu, Debian, Fedora)
   - [ ] Works in WSL (Ubuntu)
   - [ ] No regression on Windows or macOS

3. **Error Handling**
   - [ ] Clear error message if module genuinely missing
   - [ ] Actionable steps provided (reinstall, verify)
   - [ ] Debug mode shows path resolution details

4. **Testing**
   - [ ] QA validates fix in WSL Ubuntu
   - [ ] Story 1.10c test execution resumes
   - [ ] All 14 test scenarios can proceed

---

## 🚨 Escalation & Communication

### Notifications Sent

- ✅ QA (@quality-gate - Quinn): Test report created
- 🔄 Dev Lead (@developer - Dex): GitHub Issue created (this)
- ⏳ Product Owner (@product-lead - Pax): Story blocked notification pending
- ⏳ Scrum Master (@sprint-lead - River): Sprint timeline impact pending

### Expected Response Time

- **Initial Acknowledgment:** < 2 hours
- **Fix Development:** < 4 hours (P0 priority)
- **Fix Deployment:** < 6 hours total
- **QA Retest:** < 2 hours after deployment

### Success Metrics

- ⏱️ **Time to Fix:** Target < 6 hours
- ✅ **QA Validation:** Must pass all installation tests
- 📊 **Test Coverage:** Unblock 13 remaining test scenarios

---

## 🏷️ Labels

- `priority:P0` - Critical blocker
- `platform:linux` - Linux-specific issue
- `story:1.10c` - Related to Story 1.10c
- `type:bug` - Bug/defect
- `component:installer` - Installer component
- `sprint:1` - Sprint 1 blocker
- `needs:immediate-fix` - Urgent attention required

---

## 👥 Assignees & Watchers

**Assigned To:** @developer (Dex) - Development Lead
**Watchers:**

- @quality-gate (Quinn) - QA Test Architect (reporter)
- @product-lead (Pax) - Product Owner
- @sprint-lead (River) - Scrum Master

---

**Created:** 2025-01-23
**Reporter:** @quality-gate (Quinn)
**Priority:** P0 (CRITICAL)
**Status:** 🔴 Open - Awaiting Dev Fix

---

_This issue was discovered during Story 1.10c Linux platform testing and blocks all further testing. Immediate fix required to avoid Sprint 1 timeline impact._
