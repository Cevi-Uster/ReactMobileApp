import React, { useLayoutEffect } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { ErrorView, LoadingView } from '@/components/ui/StateView';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { sharedStyles } from '../../../constants/sharedStyles';
import fetchInfoData, { Info } from '../../../services/box/infoService';

const pad = (n: number) => String(n).padStart(2, '0');

function formatInfoDateTime(info: Info): string {
  let dateTime = '';
  if (info.von) {
    dateTime = `${pad(info.von.getDate())}.${pad(info.von.getMonth() + 1)}.${info.von.getFullYear()} ${pad(info.von.getHours())}:${pad(info.von.getMinutes())}`;
  }
  if (info.bis) {
    dateTime = `${dateTime} - ${pad(info.bis.getHours())}:${pad(info.bis.getMinutes())}`;
  }
  return dateTime;
}

export default function InfoBox() {
  const { parentStufe, title } = useLocalSearchParams<{ parentStufe: string; title: string }>();
  const colors = useThemeColors();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    if (title) {
      navigation.setOptions({ title });
    }
  }, [navigation, title]);

  const { data: info, isPending, isError, error, refetch } = useQuery({
    queryKey: ['chaeschtlizettel', parentStufe, title],
    queryFn: () => fetchInfoData(parentStufe, title),
    enabled: !!parentStufe && !!title,
  });

  if (isPending) return <LoadingView />;
  if (isError) return <ErrorView message={error.message} onRetry={() => refetch()} />;

  const text = { color: colors.text };

  return (
    <ScrollView>
      <View style={sharedStyles.container}>
        <Image style={sharedStyles.icon} source={require('../../../assets/images/CeviLogoTransparent.png')} />
        <View style={sharedStyles.content}>
          <Text style={[sharedStyles.title, text]}>{info.stufe}</Text>
          {info.aktuell && (
            <>
              <Text style={[styles.header, text]}>{'\n'}Treffpunkt:</Text>
              <Text style={[sharedStyles.date, { color: colors.accent }]}>{formatInfoDateTime(info)}</Text>
              <Text style={[styles.body, text]}>{info.wo}</Text>
              <Text style={[styles.header, text]}>{'\n'}Infos:</Text>
              <Text style={[styles.body, text]}>{info.infos}</Text>
              <Text style={[styles.header, text]}>{'\n'}Mitnehmen:</Text>
              <Text style={[styles.body, text]}>{info.mitnehmen}</Text>
              <View style={sharedStyles.buttonview}>
                <PrimaryButton title="Abmelden" onPress={() => dropOutButtonClicked(info)} />
              </View>
            </>
          )}
          {!info.aktuell && (
            <>
              <Text style={[styles.header, text]}>{'\n'}Infos:</Text>
              <Text style={[styles.body, text]}>{info.infos}</Text>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

function dropOutButtonClicked(info: Info) {
  router.push({
    pathname: '/box/dropout',
    params: {
      stufe: info.stufe,
      aktuell: info.aktuell.toString(),
      infos: info.infos,
      von: info.von?.toISOString(),
      bis: info.bis?.toISOString(),
      wo: info.wo,
      mit: info.mitnehmen,
      email: info.email,
    },
  });
}

const styles = StyleSheet.create({
  header: { fontSize: 16, fontWeight: 'bold' },
  body: { marginTop: 5, fontSize: 14 },
});
