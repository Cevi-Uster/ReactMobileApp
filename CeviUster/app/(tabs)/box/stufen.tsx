import React from 'react';
import { FlatList, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { decode } from 'html-entities';
import ListRow from '@/components/ui/ListRow';
import { EmptyView, ErrorView, LoadingView } from '@/components/ui/StateView';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { fetchStufenData, Stufe } from '../../../services/box/stufenService';

export default function Stufen() {
  const colors = useThemeColors();
  const { data, isPending, isError, error, refetch, isRefetching } = useQuery<Stufe[]>({
    queryKey: ['stufen'],
    queryFn: fetchStufenData,
  });

  if (isPending) return <LoadingView />;
  if (isError) return <ErrorView message={error.message} onRetry={() => refetch()} />;

  return (
    <FlatList
      style={{ backgroundColor: colors.background }}
      data={data.filter((s) => typeof s.name !== 'undefined')}
      keyExtractor={(item) => item.stufen_id.toString()}
      refreshing={isRefetching}
      onRefresh={() => refetch()}
      ListEmptyComponent={<EmptyView message="Keine Stufen gefunden." />}
      renderItem={({ item }) => (
        <ListRow
          title={decode(item.name)}
          left={
            <Image
              style={[styles.avatar, { tintColor: colors.text }]}
              source={require('../../../assets/images/Home_Icon.png')}
            />
          }
          onPress={() =>
            router.push(`/box/infobox?parentStufe=${item.stufen_id}&title=${encodeURIComponent(item.name)}`)
          }
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  avatar: { width: 34, height: 34, resizeMode: 'contain' },
});
