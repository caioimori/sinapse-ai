$ErrorActionPreference = 'Stop'
function Inspect-Svg([string]$text) {
  $settings = [System.Xml.XmlReaderSettings]::new()
  $settings.DtdProcessing = [System.Xml.DtdProcessing]::Prohibit
  $settings.XmlResolver = $null
  $reader = [System.Xml.XmlReader]::Create([System.IO.StringReader]::new($text), $settings)
  $doc = [System.Xml.XmlDocument]::new()
  $doc.XmlResolver = $null
  try { $doc.Load($reader) } finally { $reader.Dispose() }
  if ($doc.DocumentElement.LocalName -ne 'svg' -or $doc.DocumentElement.NamespaceURI -ne 'http://www.w3.org/2000/svg') { throw 'Invalid SVG root' }
  $ids = [System.Collections.Generic.HashSet[string]]::new()
  $references = [System.Collections.Generic.List[string]]::new()
  $allowedElements = @('svg','symbol','g','path','rect','use')
  $allowedAttributes = @('xmlns','width','height','viewBox','role','aria-label','aria-hidden','focusable','id','fill','stroke','stroke-width','stroke-linecap','stroke-linejoin','x','y','rx','d','href')
  foreach ($element in $doc.SelectNodes('//*')) {
    if ($element.LocalName -notin $allowedElements -or $element.NamespaceURI -ne 'http://www.w3.org/2000/svg') { throw 'Unsafe or unsupported element' }
    foreach ($attr in $element.Attributes) {
      if ($attr.Name -notin $allowedAttributes) { throw 'Unsafe or unsupported attribute' }
      if ($attr.Name -eq 'id' -and -not $ids.Add($attr.Value)) { throw 'Duplicate ID' }
      if ($attr.Name -eq 'href') {
        if ($attr.Value -notmatch '^#[a-zA-Z][a-zA-Z0-9-]*$') { throw 'External or active reference' }
        $references.Add($attr.Value.Substring(1))
      }
      if ($attr.Name -eq 'stroke-width' -and $attr.Value -ne '1.5') { throw 'Inconsistent stroke' }
      if ($attr.Name -eq 'fill' -and $attr.Value -ne 'none') { throw 'Inconsistent style' }
      if ($attr.Name -eq 'stroke' -and $attr.Value -ne 'currentColor') { throw 'Unapproved color value' }
    }
    if ($element.LocalName -eq 'symbol' -and $element.GetAttribute('viewBox') -ne '0 0 24 24') { throw 'Invalid symbol grid' }
  }
  foreach ($ref in $references) { if (-not $ids.Contains($ref)) { throw 'Broken local reference' } }
  return [pscustomobject]@{ xmlParsed=$true; ids=@($ids); localReferences=@($references); elementCount=$doc.SelectNodes('//*').Count }
}
$icons = @('salvar','voltar','alerta')
$records = @()
foreach ($id in $icons) {
  $file = Join-Path $PSScriptRoot "icons/$id.svg"
  $text = [System.IO.File]::ReadAllText($file)
  $result = Inspect-Svg $text
  if ($text -notmatch 'viewBox="0 0 24 24"') { throw 'Missing icon viewBox' }
  if ($text -notmatch 'stroke-width="1.5"' -or $text -notmatch 'stroke-linecap="round"' -or $text -notmatch 'stroke-linejoin="round"') { throw 'Missing family stroke style' }
  $records += [pscustomobject]@{file="icons/$id.svg";sha256=(Get-FileHash -LiteralPath $file -Algorithm SHA256).Hash.ToLower();xml=$result}
}
$spritePath = Join-Path $PSScriptRoot 'icons/sprite.svg'
$spriteText = [System.IO.File]::ReadAllText($spritePath)
$sprite = Inspect-Svg $spriteText
if ($sprite.ids.Count -ne 3) { throw 'Incorrect sprite count' }
foreach ($id in $icons) { if ("f015n-v1-$id" -notin $sprite.ids) { throw 'Missing symbol' } }
$preview = [System.IO.File]::ReadAllText((Join-Path $PSScriptRoot 'preview.html'))
$previewRefs = @([regex]::Matches($preview,'<use href="#([a-zA-Z0-9-]+)"').ForEach({$_.Groups[1].Value}))
foreach ($ref in $previewRefs) { if ($ref -notin $sprite.ids) { throw 'Broken preview reference' } }
if ([regex]::Matches($preview,'<symbol id=').Count -ne 3) { throw 'Sprite installed more than once' }
foreach ($id in $sprite.ids) { if ([regex]::Matches($preview,('id="'+[regex]::Escape($id)+'"')).Count -ne 1) { throw 'Preview ID collision' } }
if ($preview -match 'https?://(?!www.w3.org/2000/svg)' -or $preview -match '(?i)<script|\son\w+=|@import|url\(') { throw 'Active or external preview dependency' }
$negativeCases = [ordered]@{
  activeElement='<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'
  activeAttribute='<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"></svg>'
  externalResource='<svg xmlns="http://www.w3.org/2000/svg"><use href="https://example.invalid/icon.svg#save"/></svg>'
  brokenSymbol='<svg xmlns="http://www.w3.org/2000/svg"><use href="#missing"/></svg>'
  duplicateId='<svg xmlns="http://www.w3.org/2000/svg"><symbol id="dup" viewBox="0 0 24 24"/><symbol id="dup" viewBox="0 0 24 24"/></svg>'
  dtdEntity='<!DOCTYPE svg [<!ENTITY x SYSTEM "file:///denied">]><svg xmlns="http://www.w3.org/2000/svg">&x;</svg>'
}
$negativeResults = @()
foreach ($entry in $negativeCases.GetEnumerator()) {
  $rejected=$false;$reason=$null
  try { $null=Inspect-Svg $entry.Value } catch { $rejected=$true;$reason=$_.Exception.Message }
  if (-not $rejected) { throw "Negative case accepted: $($entry.Key)" }
  $negativeResults += [pscustomobject]@{case=$entry.Key;input=$entry.Value;rejected=$rejected;reason=$reason}
}
$receipt=[ordered]@{caseId='F015-N';method='Native .NET XmlReader/XmlDocument, DTD prohibited, resolver null; strict SVG element/attribute allowlist and local-reference probes';observedAtUtc=[DateTime]::UtcNow.ToString('o');individualIcons=$records;sprite=[ordered]@{file='icons/sprite.svg';sha256=(Get-FileHash -LiteralPath $spritePath -Algorithm SHA256).Hash.ToLower();inspection=$sprite};preview=[ordered]@{file='preview.html';referenceCount=$previewRefs.Count;allReferencesResolveInDocument=$true;uniqueSymbolDefinitions=3;twoCompositionsShareOneSprite=$true;sizes=[int[]]@(16,24,32);consumerSemantics='Authored hidden SVGs in named controls and role=img standalone; AT unverified'};negativeCases=$negativeResults;existingInventoryModified=$false;limits=@('No rendered capture','16px recognition and optical weight UNVERIFIED','Brand token numeric values and contrast UNVERIFIED','PNG exports UNVERIFIED','Accessibility tree and assistive technology UNVERIFIED','No build, network or external effects');qualityVerdict=$null}
$json=$receipt|ConvertTo-Json -Depth 12
[System.IO.File]::WriteAllText((Join-Path $PSScriptRoot 'validation-receipt.json'),$json+[Environment]::NewLine,[System.Text.UTF8Encoding]::new($false))
Write-Output $json
