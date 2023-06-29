import React from "react";
import QRGenerator from "qrcode.react";
export default class QRComp extends React.Component {
  render() {
    return (
      <div id="QRComp">
        <QRGenerator
          value={
            import.meta.env.VITE_API_PUBLIC_URL +
            localStorage.getItem("groupid")
          }
        />
        <h2>Invite Team</h2>
      </div>
    );
  }
}
