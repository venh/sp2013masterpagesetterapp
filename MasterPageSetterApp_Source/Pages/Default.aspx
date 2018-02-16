<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>

<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" Language="C#" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <script type="text/javascript" src="../Scripts/jquery-1.7.1.min.js"></script>
    <script type="text/javascript" src="../Scripts/RibbonActions.js"></script>
    <!-- Add your CSS styles to the following file -->
    <link rel="Stylesheet" type="text/css" href="../Content/App.css" />
     <script type="text/javascript">
         $(document).ready(function () {             
             var hostweburl = decodeURIComponent(getQueryStringParameterValue('SPHostUrl'));
             if ((hostweburl != 'undefined') && (hostweburl != '')) {
                 var scriptbase = hostweburl + '/_layouts/15/';
                 $.getScript(scriptbase + 'SP.RequestExecutor.js', getFile);
             }
         });
         function getQueryStringParameterValue(param) {
             if (window.location.href.indexOf('?' + param + '=') != -1) {
                 var params = document.URL.split("?")[1].split("&");
                 var strParams = "";
                 for (var i = 0; i < params.length; i = i + 1) {
                     var singleParam = params[i].split("=");
                     if (singleParam[0] == param) {
                         return singleParam[1];
                     }
                 }
             }
         }
    </script>
</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    Master Page Setter App Page
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
     <WebPartPages:AllowFraming ID="allowFramingID" runat="server" />   
</asp:Content>
