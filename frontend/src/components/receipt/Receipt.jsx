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
            fontSize: 36, // ลดขนาดฟอนต์หัวข้อให้ดูสวยงามขึ้น
            textAlign: 'center',
            marginBottom: 10,
        },
        body: {
            paddingHorizontal: 30,
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
        },
        leftColumn: {
            width: '50%',
            paddingRight: 10,
        },
        rightColumn: {
            width: '50%',
            paddingLeft: 10,
        },
        address: {
            fontFamily: 'prompt',
            fontSize: 18,
            marginBottom: 5,
        },
        divider: {
            marginVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#000',
        },
    });

    // Title Component
    const InvoiceTitle = () => (
        <Text style={styles.title}>ใบเสร็จ</Text>
    );

    // Body Component
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
                <View style={styles.divider} /> {/* เส้นแบ่งระหว่างหัวข้อและเนื้อหา */}
                <Body />
            </Page>
        </Document>
    );
};

export default Invoice;
