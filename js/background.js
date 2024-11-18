const enforce = new Set(["nfghbmabdoakhobmimnjkamfdnpfammn", "bphljigopmbjfmjbdeedhmeadmefcjbf", "watchdog@ethandawes.dev", "strict-focused-yt@ethandawes.dev"]);

chrome.management.onDisabled.addListener(info => {
    console.log(info.id);
    if (enforce.has(info.id))
        chrome.management.setEnabled(info.id, true);
});