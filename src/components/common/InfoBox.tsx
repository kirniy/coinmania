import React from "react"

type InfoBoxProps = Readonly<{
    children: React.ReactNode;
}>;

const InfoBox: React.FC<InfoBoxProps> = ({ children }) => {
    const infoBoxStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderLeft: '4px solid #f8cc46',
        padding: '8px 12px',
        marginBottom: '25px',
        borderRadius: '0 10px 10px 0',
    };

    return (
        <div style={infoBoxStyle}>
            <p
                style={{fontSize: '0.9rem', color: '#f0f0f0', lineHeight: '1.4'}}
            >
                {children}
            </p>
        </div>
    )
}

export default InfoBox;