import React from 'react';
import { formatPrice } from '../../utils/formatPrice';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import moment from 'moment';
import fontDev from '../../fonts/Prompt.ttf';

// Register font
Font.register({ family: 'prompt', src: fontDev });

const Invoice = ({ reservation }) => {
    const styles = StyleSheet.create({
        page: {
            padding: 20,
            backgroundColor: '#FFFFFF',
        },
        title: {
            fontFamily: 'prompt',
            fontSize: 50,
            textAlign: 'center',
            marginBottom: 20,
        },
        body: {
            paddingHorizontal: 40,
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between', // Keep items spaced out
            marginBottom: 10,
        },
        leftColumn: {
            width: '50%', // Left column width
        },
        rightColumn: {
            width: '50%', // Right column width
            textAlign: 'left', // Change this to align text to the left
        },
        address: {
            fontFamily: 'prompt',
            fontSize: 24,
        },
    });

    // Title
    const InvoiceTitle = () => (
        <Text style={styles.title}>ใบเสร็จ</Text>
    );

    // Body
    const Body = () => (
        <View style={styles.body}>
            <View style={styles.row}>
                <View style={styles.leftColumn}>
                    <Text style={styles.address}>ชื่อ: {reservation.firstname} {reservation.lastname}</Text>
                    <Text style={styles.address}>วันที่จอง: {moment(reservation.created_at).format('DD/MM/YYYY')}</Text>
                    <Text style={styles.address}>วันที่ขาย: {moment(reservation.booking_date).format('DD/MM/YYYY')}</Text>
                </View>
                <View style={styles.rightColumn}>
                    <Text style={styles.address}>รหัส: {reservation.booking_id}</Text>
                    <Text style={styles.address}>ชื่อรายการ: {reservation.dogs_name}</Text>
                    <Text style={styles.address}>ราคา: {formatPrice(reservation.price)}</Text>
                    <Text style={styles.address}>รวม: {formatPrice(reservation.price)}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <Document>
            <Page size="A4" style={styles.page} orientation="landscape">
                <InvoiceTitle />
                <Body />
            </Page>
        </Document>
    );
};

export default Invoice;
