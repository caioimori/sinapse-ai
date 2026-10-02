"""Append current-source verification, preserving both immutable render receipts."""
import hashlib
import json
from pathlib import Path
import sys

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]


def source(path):
    return {'path': path.relative_to(ROOT).as_posix(), 'sha256': hashlib.sha256(path.read_bytes()).hexdigest()}


def main():
    attempt = int(sys.argv[1]) if len(sys.argv) > 1 else 2
    if not 1 <= attempt <= 3:
        raise ValueError('At most three render attempts')
    out = HERE.parent / 'output' / 'media' / f'attempt-{attempt:03d}'
    receipt = json.loads((out / 'receipt.json').read_text(encoding='utf-8'))
    browser = sorted(out.glob('browser-*/receipt.json'))[-1]
    browser_receipt = json.loads(browser.read_text(encoding='utf-8'))
    if receipt['status'] != 'technical-pass-pending-independent-review' or browser_receipt['status'] != 'technical-pass':
        raise ValueError('Final technical evidence must pass')
    current = [source(path) for path in sorted(HERE.rglob('*')) if path.is_file() and '__pycache__' not in str(path) and path.name != 'source-manifest.json']
    current += [source(HERE.parent / name) for name in ['index.html', 'serve.cjs', 'shared.css']]
    outputs = [source(path) for path in sorted(out.rglob('*')) if path.is_file() and path.name != 'verification-summary.json']
    summary = {
        'schemaVersion': 1, 'attempt': attempt, 'status': 'technical-pass-audio-not-observed',
        'renderReceiptUnmodified': source(out / 'receipt.json'), 'finalBrowserReceipt': source(browser),
        'currentSourceSha256': current, 'outputsAfterAccessibilityCorrection': outputs,
        'accessibilityCorrection': 'Updated only visual descriptions and preview references after attempt002; main copy/media bytes unchanged. Prior render receipts preserve their actual execution-source versions.',
        'geometryOverride': 'Original generic nodes/cards refined to an intention worksheet, Texto/Imagem/Ritmo storyboard and review checklist after independent review of attempt001. production-plan remains the frozen planning input.',
        'observedPixels': {'observer': 'author', 'method': 'view_image', 'files': ['carousel-contact.png', 'carousel-03.png', 'carousel-mobile-390.png', 'reel-mobile-390.png', 'browser-2/media-1440.png', 'browser-2/player-390.png']},
        'observedAudioOrNotObserved': 'not_observed',
        'independentReview': 'Separate root-owned review; author provides no aesthetic score.',
        'failuresAndSkips': ['Subjective audio listening unavailable; overall audiovisual approval remains CONCERNS.'],
        'localOnly': True,
    }
    summary_path = out / 'verification-summary.json'
    summary_path.write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding='utf-8')
    manifest_path = HERE / 'source-manifest.json'
    manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
    if 'planningSourceVersions' not in manifest:
        manifest['planningSourceVersions'] = manifest['sources']
    known = {entry['path']: entry for entry in manifest['planningSourceVersions']}
    for entry in current:
        known[entry['path']] = entry
    manifest.update({
        'sources': list(known.values()), 'rendered': True, 'currentAttempt': attempt,
        'status': 'local-technical-pass-pending-audiovisual-review', 'pixelsObserved': True,
        'audioObserved': False, 'renderer': 'Native Windows Python/Pillow with own geometry and oscillator WAV; native ffmpeg H264/AAC. No network, installations, sampled audio or client data.',
        'finalVerification': source(summary_path),
        'renderReceipts': [source(path) for path in sorted((HERE.parent/'output'/'media').glob('attempt-*/receipt.json'))],
        'outputs': outputs + [source(summary_path)],
        'observedChecks': ['five RGB PNG pages1080x1350', 'five editable SVGs', '18s540frames30fps1080x1920H264yuv420p', 'AACstereo48000Hz', 'originalWAV and full18s8kbpsreviewMP3', 'full audiovisual decode', 'encoded RMS and peak; no clips', 'all authored text boxes measured', 'master frame extraction before/after cuts', 'all five pages/browser1440/390 without horizontal overflow', 'HTML video playback and five VTT cues observed'],
    })
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps({'manifest': source(manifest_path), 'summary': source(summary_path), 'audioObserved': False}, ensure_ascii=False))


if __name__ == '__main__':
    main()
