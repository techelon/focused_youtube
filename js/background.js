const enforce = new Set(["nfghbmabdoakhobmimnjkamfdnpfammn", "bphljigopmbjfmjbdeedhmeadmefcjbf"]);

chrome.management.onDisabled.addListener(info => {
    console.log(info.id);
    if (enforce.has(info.id))
        chrome.management.setEnabled(info.id, true);
});