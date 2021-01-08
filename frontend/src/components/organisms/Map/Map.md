```jsx
import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";

import theme from "../../../theme";

const mapData = [
    {
        location: {
            y: 42.3687216,
            x: -71.1174226,
            address: '123 Main St, Boston, MA 02101',
        },
    },    
];

<ThemeProvider theme={theme}>
    <div style={{ position: 'relative', width: '100%', height: 600 }}>
        <Map pins={mapData} center={[42.3687216, -71.1174226]} />
    </div>
</ThemeProvider>