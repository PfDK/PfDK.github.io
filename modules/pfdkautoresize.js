function PfDKAutoResizeIframe(iframe) {
    $(iframe).height($(iframe).contents().find('html').height());
}