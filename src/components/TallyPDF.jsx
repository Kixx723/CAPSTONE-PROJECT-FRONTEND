import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import logo from '../assets/logo.png';

const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#f7f7f7', // Light gray na background
      padding: 20,
    },
    header: {
      fontSize: 24,
      textAlign: 'center',
      marginBottom: 20,
      color: '#333',
    },
    table: {
      width: '100%',
      fontSize: 12,
      border: '1 solid #ddd', // Light gray na border
      borderRadius: 5,
      marginTop: 10,
    },
    headerRow: {
      flexDirection: 'row',
      backgroundColor: '#f2f2f2',
      borderBottomColor: '#ddd',
      borderBottomWidth: 1,
      alignItems: 'center',
    },
    row: {
      flexDirection: 'row',
      borderBottomColor: '#ddd',
      borderBottomWidth: 1,
      alignItems: 'center',
      backgroundColor: '#f9f9f9', 
    },
    cell: {
      padding: 10,
      borderRightColor: '#ddd',
      borderRightWidth: 1,
      flexGrow: 1,
      textAlign: 'left', 
    },
    rankCell: {
      width: '15%',
      textAlign: 'center',
    },
    departmentCell: {
      width: '30%',
      textAlign: 'center',
    },
    medalCell: {
      width: '20%',
      textAlign: 'center',
      fontWeight: 'bold', 
    },
    totalCell: {
      width: '20%',
      textAlign: 'center',
      fontWeight: 'bold', 
    },
    gold: {
      backgroundColor: '#FFD700',
    },
    silver: {
      backgroundColor: '#C0C0C0',
    },
    bronze: {
      backgroundColor: '#CD7F32',
    },
    container: {
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 10, 
    },
    HTC: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'green',
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 12,
    },
    logo: {
        width: 50, 
        height: 50, 
        marginRight: 10,
      },
  });
  
  const TallyPDF = ({ departmentMedals, eventName, results, sportsEvents }) => {
    return (
      <Document>

<Page size="A4" style={styles.page}>
          <View style={styles.container}>
          <Image src={logo} style={styles.logo} />
          <Text style={[styles.HTC]}>Holy Trinity College of General Santos City</Text>
          </View>
          <Text style={[styles.header, styles.bold]}>
            {eventName} Official Medal Tally Sheet
          </Text>
          <View style={styles.table}>
            {/* Table header */}
            <View style={styles.headerRow}>
              <View style={[styles.cell, styles.departmentCell]}>
                <Text>SPORTS EVENTS</Text>
              </View>
              <View style={[styles.cell, styles.departmentCell]}>
                <Text>GOLD</Text>
              </View>
              <View style={[styles.cell, styles.departmentCell]}>
                <Text>SILVER</Text>
              </View>
              <View style={[styles.cell, styles.departmentCell]}>
                <Text>BRONZE</Text>
              </View>
              <View style={[styles.cell, styles.totalCell]}>
                <Text>MEDAL COUNT</Text>
              </View>
            </View>
            {/* Table data */}
            {sportsEvents.map((sportevent) => (
              <View key={sportevent?._id} style={styles.row}>
                <View style={[styles.cell, styles.departmentCell]}>
                  <Text>{sportevent.name}</Text>
                </View>
                <View style={[styles.cell, styles.departmentCell]}>
                  <Text>{results.map((result) => {
                // Assuming each result has a sportEventId to match with sportevent._id
                if (result.sportevent._id === sportevent._id) {
                    return result.gold.name;
                }
                return null; // Handle if no matching result is found
            }).filter(Boolean)[0] || 'No result yet'}</Text>
                </View>
                <View style={[styles.cell, styles.departmentCell]}>
                  <Text>{results.map((result) => {
                if (result.sportevent._id === sportevent._id) {
                    return result.silver.name;
                }
                return null;
            }).filter(Boolean)[0] || 'No result yet'}</Text>
                </View>
                <View style={[styles.cell, styles.departmentCell]}>
                  <Text>{results.map((result) => {
                if (result.sportevent._id === sportevent._id) {
                    return result.bronze.name;
                }
                return null;
            }).filter(Boolean)[0] || 'No result yet'}</Text>
                </View>
                <View style={[styles.cell, styles.totalCell]}>
                  <Text>{sportevent.medalCount}</Text>
                </View>
              </View>
            ))}
          </View>
        </Page>

        <Page size="A4" style={styles.page}>
          {/* <View style={styles.container}>
          <Image src={logo} style={styles.logo} />
          <Text style={[styles.HTC]}>Holy Trinity College of General Santos City</Text>
          </View>
          <Text style={[styles.header, styles.bold]}>
            {eventName} Official Medal Tally Sheet
          </Text> */}
          <View style={styles.table}>
            {/* Table header */}
            <View style={styles.headerRow}>
              <View style={[styles.cell, styles.rankCell]}>
                <Text>RANK</Text>
              </View>
              <View style={[styles.cell, styles.departmentCell]}>
                <Text>DEPARTMENT</Text>
              </View>
              <View style={[styles.cell, styles.medalCell, styles.gold]}>
                <Text>GOLD</Text>
              </View>
              <View style={[styles.cell, styles.medalCell, styles.silver]}>
                <Text>SILVER</Text>
              </View>
              <View style={[styles.cell, styles.medalCell, styles.bronze]}>
                <Text>BRONZE</Text>
              </View>
              <View style={[styles.cell, styles.totalCell]}>
                <Text>TOTAL</Text>
              </View>
            </View>
            {/* Table data */}
            {departmentMedals.map((medal, rank) => (
              <View key={medal?.department._id} style={styles.row}>
                <View style={[styles.cell, styles.rankCell]}>
                  <Text>{rank + 1}</Text>
                </View>
                <View style={[styles.cell, styles.departmentCell]}>
                  <Text>{medal.department.name}</Text>
                </View>
                <View style={[styles.cell, styles.medalCell, styles.gold]}>
                  <Text>{medal.gold}</Text>
                </View>
                <View style={[styles.cell, styles.medalCell, styles.silver]}>
                  <Text>{medal.silver}</Text>
                </View>
                <View style={[styles.cell, styles.medalCell, styles.bronze]}>
                  <Text>{medal.bronze}</Text>
                </View>
                <View style={[styles.cell, styles.totalCell]}>
                  <Text>{medal.total}</Text>
                </View>
              </View>
            ))}
          </View>
        </Page>
      </Document>
    );
  };

export default TallyPDF;